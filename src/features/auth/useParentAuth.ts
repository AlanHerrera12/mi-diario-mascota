import { useState } from 'react';
import * as SecureStore from 'expo-secure-store';
import { supabase } from '../../lib/supabase';
import { hashPin, generateAvatarSeed } from '../../lib/encryption';
import { useAuthStore } from '../../stores/auth.store';
import { usePetStore } from '../../stores/pet.store';
import type { Child, Pet, PetSpecies } from '../../types';

const SECURE_KEY_PIN_HASH = 'parent_pin_hash';
const SECURE_KEY_CHILD_ID = 'active_child_id';

// ---- Signup ----------------------------------------------------------------

interface SignupParams {
  email: string;
  password: string;
  fullName: string;
  countryCode: string;
}

export function useParentSignup() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function signup({ email, password, fullName, countryCode }: SignupParams) {
    setLoading(true);
    setError(null);
    try {
      const { data, error: authError } = await supabase.auth.signUp({ email, password });
      if (authError) throw authError;
      if (!data.user) throw new Error('No se pudo crear la cuenta.');
      // El registro en la tabla `parents` se completa en parent-verify
      // cuando el padre acepta el consentimiento y crea su PIN.
      // Guardamos el nombre y país temporalmente en SecureStore para ese paso.
      await SecureStore.setItemAsync('signup_full_name', fullName);
      await SecureStore.setItemAsync('signup_country_code', countryCode);
      return { userId: data.user.id };
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Error desconocido';
      setError(msg);
      return null;
    } finally {
      setLoading(false);
    }
  }

  return { signup, loading, error };
}

// ---- Verificación COPPA + PIN + registro en tabla parents ------------------

interface VerifyParams {
  pin: string;
  consentMethod: 'credit_card' | 'gov_id' | 'email_plus_form';
}

export function useParentVerify() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const setParent = useAuthStore(s => s.setParent);

  async function verify({ pin, consentMethod }: VerifyParams) {
    setLoading(true);
    setError(null);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Sesión expirada. Por favor iniciá sesión de nuevo.');

      const fullName = await SecureStore.getItemAsync('signup_full_name') ?? '';
      const countryCode = await SecureStore.getItemAsync('signup_country_code') ?? 'AR';
      const pinHash = await hashPin(pin);

      const { data: parent, error: insertError } = await supabase
        .from('parents')
        .insert({
          id: user.id,
          email: user.email!,
          full_name: fullName,
          consent_given_at: new Date().toISOString(),
          consent_method: consentMethod,
          country_code: countryCode,
          parent_pin_hash: pinHash,
          subscription_status: 'trial',
          trial_started_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (insertError) throw insertError;

      // Guardar PIN hash en SecureStore para validación offline rápida
      await SecureStore.setItemAsync(SECURE_KEY_PIN_HASH, pinHash);

      // Limpiar datos temporales
      await SecureStore.deleteItemAsync('signup_full_name');
      await SecureStore.deleteItemAsync('signup_country_code');

      setParent(parent);
      return true;
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Error al guardar el perfil.';
      setError(msg);
      return false;
    } finally {
      setLoading(false);
    }
  }

  return { verify, loading, error };
}

// ---- Crear perfil del niño + mascota inicial --------------------------------

interface ChildSetupParams {
  displayName: string;
  ageRange: Child['ageRange'];
  petName: string;
  petSpecies: PetSpecies;
  petBaseColor: string;
  petAccentColor: string;
}

export function useChildSetup() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const setActiveChild = useAuthStore(s => s.setActiveChild);
  const setPet = usePetStore(s => s.setPet);

  async function setupChild(params: ChildSetupParams) {
    setLoading(true);
    setError(null);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No autenticado.');

      // Crear el niño
      const { data: child, error: childError } = await supabase
        .from('children')
        .insert({
          parent_id: user.id,
          display_name: params.displayName,
          age_range: params.ageRange,
          avatar_seed: generateAvatarSeed(),
        })
        .select()
        .single();

      if (childError) throw childError;

      // Crear la mascota
      const { data: pet, error: petError } = await supabase
        .from('pets')
        .insert({
          child_id: child.id,
          name: params.petName,
          species: params.petSpecies,
          customization: {
            baseColor: params.petBaseColor,
            accentColor: params.petAccentColor,
            equippedItems: [],
          },
        })
        .select()
        .single();

      if (petError) throw petError;

      // Crear la racha inicial
      await supabase.from('streaks').insert({ child_id: child.id });

      // Guardar el child_id activo en SecureStore para carga rápida al reiniciar
      await SecureStore.setItemAsync(SECURE_KEY_CHILD_ID, child.id);

      setActiveChild(child as Child);
      setPet(pet as Pet);
      return true;
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Error al crear el perfil.';
      setError(msg);
      return false;
    } finally {
      setLoading(false);
    }
  }

  return { setupChild, loading, error };
}

// ---- Login -----------------------------------------------------------------

export function useParentLogin() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const setParent = useAuthStore(s => s.setParent);
  const setActiveChild = useAuthStore(s => s.setActiveChild);
  const setPet = usePetStore(s => s.setPet);

  async function login(email: string, password: string) {
    setLoading(true);
    setError(null);
    try {
      const { error: authError } = await supabase.auth.signInWithPassword({ email, password });
      if (authError) throw authError;

      // Cargar datos del padre
      const { data: parent, error: parentError } = await supabase
        .from('parents')
        .select('*')
        .single();
      if (parentError) throw parentError;

      // Cargar el primer hijo (MVP: un hijo por cuenta)
      const { data: children, error: childError } = await supabase
        .from('children')
        .select('*')
        .limit(1);
      if (childError) throw childError;

      const child = children?.[0] ?? null;

      if (child) {
        const { data: pets } = await supabase
          .from('pets')
          .select('*')
          .eq('child_id', child.id)
          .limit(1);
        const pet = pets?.[0] ?? null;

        await SecureStore.setItemAsync(SECURE_KEY_CHILD_ID, child.id);
        setActiveChild(child as Child);
        if (pet) setPet(pet as Pet);
      }

      setParent(parent);
      return { hasChild: !!child };
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Email o contraseña incorrectos.';
      setError(msg);
      return null;
    } finally {
      setLoading(false);
    }
  }

  return { login, loading, error };
}

// ---- Validación de PIN (dashboard parental) --------------------------------

export async function validateParentPin(pin: string): Promise<boolean> {
  const storedHash = await SecureStore.getItemAsync(SECURE_KEY_PIN_HASH);
  if (!storedHash) return false;
  const inputHash = await hashPin(pin);
  return inputHash === storedHash;
}

// ---- Signout ---------------------------------------------------------------

export async function signOut() {
  await supabase.auth.signOut();
  await SecureStore.deleteItemAsync(SECURE_KEY_PIN_HASH);
  await SecureStore.deleteItemAsync(SECURE_KEY_CHILD_ID);
}

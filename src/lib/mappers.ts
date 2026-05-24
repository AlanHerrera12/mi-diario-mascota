import type { Parent, Child, Pet } from '../types';

// Supabase returns snake_case; our domain types use camelCase.
// These mappers convert raw DB rows to typed domain objects.

export function mapParent(raw: Record<string, unknown>): Parent {
  return {
    id: raw.id as string,
    email: raw.email as string,
    fullName: raw.full_name as string,
    consentGivenAt: raw.consent_given_at as string,
    consentMethod: raw.consent_method as Parent['consentMethod'],
    countryCode: raw.country_code as string,
    subscriptionStatus: raw.subscription_status as Parent['subscriptionStatus'],
    trialStartedAt: (raw.trial_started_at as string) ?? null,
    createdAt: raw.created_at as string,
  };
}

export function mapChild(raw: Record<string, unknown>): Child {
  return {
    id: raw.id as string,
    parentId: raw.parent_id as string,
    displayName: raw.display_name as string,
    ageRange: raw.age_range as Child['ageRange'],
    avatarSeed: raw.avatar_seed as string,
    createdAt: raw.created_at as string,
  };
}

export function mapPet(raw: Record<string, unknown>): Pet {
  return {
    id: raw.id as string,
    childId: raw.child_id as string,
    name: raw.name as string,
    species: raw.species as Pet['species'],
    customization: raw.customization as Pet['customization'],
    level: raw.level as number,
    happiness: raw.happiness as number,
    createdAt: raw.created_at as string,
  };
}

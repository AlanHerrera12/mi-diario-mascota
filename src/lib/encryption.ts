import * as Crypto from 'expo-crypto';

// ============================================================
// Utilidades de encriptación para datos sensibles en cliente
// Las transcripciones completas se encriptan en backend
// Aquí solo manejamos hashes y validación de PIN
// ============================================================

export async function hashPin(pin: string): Promise<string> {
  const digest = await Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA256, pin, {
    encoding: Crypto.CryptoEncoding.HEX,
  });
  return digest;
}

export async function verifyPin(pin: string, storedHash: string): Promise<boolean> {
  const hash = await hashPin(pin);
  return hash === storedHash;
}

// Genera un ID único criptográficamente seguro para seeds de avatares
export function generateAvatarSeed(): string {
  const randomBytes = Crypto.getRandomBytes(16);
  return Array.from(randomBytes)
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

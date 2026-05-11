// Mock expo-crypto before importing encryption
jest.mock('expo-crypto', () => ({
  digestStringAsync: jest.fn((_alg: string, input: string, _opts?: unknown) =>
    Promise.resolve(`mocked-hash-${input}`),
  ),
  CryptoDigestAlgorithm: { SHA256: 'SHA-256' },
  CryptoEncoding: { HEX: 'hex', BASE64: 'base64' },
  getRandomBytes: jest.fn((size: number) => new Uint8Array(size).fill(0)),
}));

import { hashPin } from '../src/lib/encryption';

describe('hashPin', () => {
  it('returns a string', async () => {
    const result = await hashPin('1234');
    expect(typeof result).toBe('string');
  });

  it('returns different hashes for different PINs', async () => {
    const h1 = await hashPin('1234');
    const h2 = await hashPin('5678');
    expect(h1).not.toBe(h2);
  });

  it('is deterministic — same PIN gives same hash', async () => {
    const h1 = await hashPin('9999');
    const h2 = await hashPin('9999');
    expect(h1).toBe(h2);
  });
});

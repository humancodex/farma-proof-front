/**
 * Crypto utilities for local encryption/decryption
 * Used for handling VC blobs locally (optional)
 */

/**
 * Encrypt data using Web Crypto API
 */
export async function encryptData(
  data: string,
  password: string
): Promise<{ encrypted: string; salt: string; iv: string }> {
  const encoder = new TextEncoder();
  const dataBuffer = encoder.encode(data);
  
  // Generate salt and IV
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const iv = crypto.getRandomValues(new Uint8Array(12));
  
  // Derive key from password
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    encoder.encode(password),
    'PBKDF2',
    false,
    ['deriveBits', 'deriveKey']
  );
  
  const key = await crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt,
      iterations: 100000,
      hash: 'SHA-256',
    },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt']
  );
  
  // Encrypt
  const encrypted = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    key,
    dataBuffer
  );
  
  return {
    encrypted: Buffer.from(encrypted).toString('base64'),
    salt: Buffer.from(salt).toString('base64'),
    iv: Buffer.from(iv).toString('base64'),
  };
}

/**
 * Decrypt data using Web Crypto API
 */
export async function decryptData(
  encryptedData: string,
  password: string,
  salt: string,
  iv: string
): Promise<string> {
  const encoder = new TextEncoder();
  const decoder = new TextDecoder();
  
  const encryptedBuffer = Buffer.from(encryptedData, 'base64');
  const saltBuffer = Buffer.from(salt, 'base64');
  const ivBuffer = Buffer.from(iv, 'base64');
  
  // Derive key from password
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    encoder.encode(password),
    'PBKDF2',
    false,
    ['deriveBits', 'deriveKey']
  );
  
  const key = await crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: saltBuffer,
      iterations: 100000,
      hash: 'SHA-256',
    },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    false,
    ['decrypt']
  );
  
  // Decrypt
  const decrypted = await crypto.subtle.decrypt(
    { name: 'AES-GCM', iv: ivBuffer },
    key,
    encryptedBuffer
  );
  
  return decoder.decode(decrypted);
}

/**
 * Generate a secure random hex string
 */
export function generateRandomHex(bytes: number = 32): string {
  const array = crypto.getRandomValues(new Uint8Array(bytes));
  return '0x' + Array.from(array)
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}
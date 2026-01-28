// TOTP (Time-based One-Time Password) implementation based on RFC 6238

const base32Chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';

function base32Decode(encoded: string): Uint8Array {
  const cleanedInput = encoded.toUpperCase().replace(/[^A-Z2-7]/g, '');
  
  if (cleanedInput.length === 0) {
    return new Uint8Array(0);
  }

  const bits: number[] = [];
  for (const char of cleanedInput) {
    const value = base32Chars.indexOf(char);
    if (value === -1) continue;
    for (let i = 4; i >= 0; i--) {
      bits.push((value >> i) & 1);
    }
  }

  const bytes: number[] = [];
  for (let i = 0; i + 8 <= bits.length; i += 8) {
    let byte = 0;
    for (let j = 0; j < 8; j++) {
      byte = (byte << 1) | bits[i + j];
    }
    bytes.push(byte);
  }

  return new Uint8Array(bytes);
}

async function hmacSha1(key: Uint8Array, message: Uint8Array): Promise<Uint8Array> {
  const keyBuffer = key.buffer.slice(key.byteOffset, key.byteOffset + key.byteLength) as ArrayBuffer;
  const messageBuffer = message.buffer.slice(message.byteOffset, message.byteOffset + message.byteLength) as ArrayBuffer;
  
  const cryptoKey = await crypto.subtle.importKey(
    'raw',
    keyBuffer,
    { name: 'HMAC', hash: 'SHA-1' },
    false,
    ['sign']
  );
  
  const signature = await crypto.subtle.sign('HMAC', cryptoKey, messageBuffer);
  return new Uint8Array(signature);
}

function intToBytes(num: number): Uint8Array {
  const bytes = new Uint8Array(8);
  for (let i = 7; i >= 0; i--) {
    bytes[i] = num & 0xff;
    num = Math.floor(num / 256);
  }
  return bytes;
}

export async function generateTOTP(secret: string, timeStep: number = 30, digits: number = 6): Promise<string> {
  const key = base32Decode(secret);
  
  if (key.length === 0) {
    return '------';
  }

  const time = Math.floor(Date.now() / 1000);
  const counter = Math.floor(time / timeStep);
  const counterBytes = intToBytes(counter);
  
  const hmac = await hmacSha1(key, counterBytes);
  
  // Dynamic truncation
  const offset = hmac[hmac.length - 1] & 0x0f;
  const binary = 
    ((hmac[offset] & 0x7f) << 24) |
    ((hmac[offset + 1] & 0xff) << 16) |
    ((hmac[offset + 2] & 0xff) << 8) |
    (hmac[offset + 3] & 0xff);
  
  const otp = binary % Math.pow(10, digits);
  return otp.toString().padStart(digits, '0');
}

export function getTimeRemaining(timeStep: number = 30): number {
  const time = Math.floor(Date.now() / 1000);
  return timeStep - (time % timeStep);
}

export function isValidBase32(secret: string): boolean {
  const cleaned = secret.toUpperCase().replace(/[^A-Z2-7]/g, '');
  return cleaned.length >= 16; // Most 2FA secrets are at least 16 characters
}

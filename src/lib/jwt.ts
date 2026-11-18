import jwt from 'jsonwebtoken';

export interface JWTPayload {
  id: string;
  email: string;
  name: string;
  role: string;
}

// Read lazily so that `next build` does not require the secret.
function getSecret(): string {
  const secret = process.env.NEXTAUTH_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error('NEXTAUTH_SECRET must be set and at least 32 characters long');
  }
  return secret;
}

export function generateToken(payload: JWTPayload): string {
  return jwt.sign(payload, getSecret(), { expiresIn: '7d' });
}

export function verifyToken(token: string): JWTPayload | null {
  try {
    return jwt.verify(token, getSecret()) as JWTPayload;
  } catch {
    return null;
  }
}

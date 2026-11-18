import bcryptjs from 'bcryptjs';

export interface MockUser {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  role: string;
}

// Pre-hashed passwords for demo (password123)
const PASSWORD_HASH = bcryptjs.hashSync('password123', 10);

export const MOCK_USERS: { [key: string]: MockUser } = {
  'angela@test.com': {
    id: '1',
    name: 'Angela Test',
    email: 'angela@test.com',
    passwordHash: PASSWORD_HASH,
    role: 'PET_OWNER',
  },
  'vet@test.com': {
    id: '2',
    name: 'Dr. Veterinario',
    email: 'vet@test.com',
    passwordHash: PASSWORD_HASH,
    role: 'VETERINARIAN',
  },
};

export const SIGNUP_USERS: { [key: string]: MockUser } = {};

export function findUserByEmail(email: string): MockUser | null {
  return MOCK_USERS[email] || SIGNUP_USERS[email] || null;
}

export function createUser(user: MockUser): MockUser {
  SIGNUP_USERS[user.email] = user;
  return user;
}

export async function verifyPassword(email: string, password: string): Promise<boolean> {
  const user = findUserByEmail(email);
  if (!user) return false;
  return await bcryptjs.compare(password, user.passwordHash);
}

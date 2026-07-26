import { describe, it, expect } from 'vitest';

import { registerSchema, loginSchema } from '@/features/auth/schemas/auth.schema';

const validRegistration = {
  full_name: 'محمد العبدلي',
  email: 'user@example.com',
  password: 'password123',
  confirmPassword: 'password123',
};

describe('registerSchema', () => {
  it('accepts a valid registration', () => {
    expect(registerSchema.safeParse(validRegistration).success).toBe(true);
  });

  it('rejects mismatched passwords and points at the confirm field', () => {
    const result = registerSchema.safeParse({
      ...validRegistration,
      confirmPassword: 'different123',
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].path).toContain('confirmPassword');
    }
  });

  it('rejects a password shorter than 8 characters', () => {
    const result = registerSchema.safeParse({
      ...validRegistration,
      password: 'short',
      confirmPassword: 'short',
    });

    expect(result.success).toBe(false);
  });

  it('rejects an invalid email', () => {
    const result = registerSchema.safeParse({ ...validRegistration, email: 'not-an-email' });

    expect(result.success).toBe(false);
  });

  it('rejects a one-character name', () => {
    const result = registerSchema.safeParse({ ...validRegistration, full_name: 'م' });

    expect(result.success).toBe(false);
  });
});

describe('loginSchema', () => {
  it('accepts valid credentials', () => {
    const result = loginSchema.safeParse({ email: 'user@example.com', password: 'anything' });

    expect(result.success).toBe(true);
  });

  it('rejects an empty password', () => {
    const result = loginSchema.safeParse({ email: 'user@example.com', password: '' });

    expect(result.success).toBe(false);
  });
});

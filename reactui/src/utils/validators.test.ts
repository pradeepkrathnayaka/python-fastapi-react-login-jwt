import { describe, it, expect } from 'vitest';
import {
  isValidEmail,
  isValidUsername,
  isValidPassword,
  passwordsMatch,
  isNotEmpty,
} from './validators';

describe('isValidEmail', () => {
  it('accepts a valid email', () => {
    expect(isValidEmail('user@example.com')).toBe(true);
  });

  it('rejects an email without @', () => {
    expect(isValidEmail('userexample.com')).toBe(false);
  });

  it('rejects an email without domain', () => {
    expect(isValidEmail('user@')).toBe(false);
  });
});

describe('isValidUsername', () => {
  it('accepts a valid username', () => {
    expect(isValidUsername('john_doe')).toBe(true);
  });

  it('rejects a username shorter than 3 characters', () => {
    expect(isValidUsername('ab')).toBe(false);
  });

  it('rejects a username with special characters', () => {
    expect(isValidUsername('john-doe')).toBe(false);
  });
});

describe('isValidPassword', () => {
  it('accepts a password with 8+ characters', () => {
    expect(isValidPassword('password123')).toBe(true);
  });

  it('rejects a password shorter than 8 characters', () => {
    expect(isValidPassword('pass')).toBe(false);
  });
});

describe('passwordsMatch', () => {
  it('returns true when passwords match', () => {
    expect(passwordsMatch('secret123', 'secret123')).toBe(true);
  });

  it('returns false when passwords differ', () => {
    expect(passwordsMatch('secret123', 'secret456')).toBe(false);
  });
});

describe('isNotEmpty', () => {
  it('returns true for non-empty string', () => {
    expect(isNotEmpty('hello')).toBe(true);
  });

  it('returns false for empty string', () => {
    expect(isNotEmpty('')).toBe(false);
  });

  it('returns false for whitespace-only string', () => {
    expect(isNotEmpty('   ')).toBe(false);
  });
});

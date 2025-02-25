import dotenv from 'dotenv';

dotenv.config();

export function env(name: string, defaultValue?: unknown): string {
  const value = process.env[name];

  if (value) return value;

  if (defaultValue) return String(defaultValue);

  throw new Error(`Missing: process.env['${name}'].`);
}

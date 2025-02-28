import dotenv from 'dotenv';

dotenv.config();

export const env = (name: string, defaultValue?: unknown) => {
  const value = process.env[name];

  if (value) return value;

  if (defaultValue) return String(defaultValue);

  throw new Error(`Missing: process.env['${name}'].`);
};

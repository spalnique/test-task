export const ENV_VARS = {
  OPENAI_API_KEY: 'OPENAI_API_KEY',
  MONGODB_URI: 'MONGODB_URI',
  PORT: 'PORT',
};

export const OPENAI_API_URL =
  'wss://api.openai.com/v1/realtime?model=gpt-4o-realtime-preview-2024-12-17';

export enum ErrorMessages {
  ROUTE_NOT_FOUND = 'Route not found',
  INTERNAL_SERVER_ERROR = 'Something went wrong',
  EMAIL_IN_USE = 'Email is already in use',
  PASSWORD_TOO_SHORT = 'Password must have at least 8 characters',
  BAD_CREDENTIALS = 'Bad credentials',
  USER_NOT_FOUND = 'User not found',
}

export enum SuccesMessages {
  SIGN_UP = 'Successfully registered new user',
}

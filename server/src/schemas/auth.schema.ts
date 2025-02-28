import { FastifySchema } from 'fastify/types/schema';

export const signupSchema: FastifySchema = {
  body: {
    type: 'object',
    required: ['email', 'password'],
    properties: {
      email: {
        type: 'string',
        format: 'email',
        errorMessage: 'Email must be a valid email address',
      },
      password: {
        type: 'string',
        minLength: 8,
        errorMessage: 'Password must be at least 8 characters long',
      },
    },
    additionalProperties: false,
    errorMessage: {
      required: {
        email: 'Email is required',
        password: 'Password is required',
      },

      additionalProperties:
        'Only email and password properties are allowed in body',
    },
  },
};

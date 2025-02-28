import ajvErrors from 'ajv-errors';
import ajvFormats from 'ajv-formats';
import { FastifyServerOptions } from 'fastify';

import { schemaErrorFormatter } from '@utils';

export const fastifyConfig: FastifyServerOptions = {
  ajv: {
    customOptions: {
      allErrors: true,
      removeAdditional: true,
      coerceTypes: true,
      strict: true,
    },
    plugins: [ajvFormats, ajvErrors],
  },
  schemaErrorFormatter,
};

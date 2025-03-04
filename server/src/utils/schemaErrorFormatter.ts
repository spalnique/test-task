import { SchemaErrorFormatter } from 'fastify/types/schema';

export const schemaErrorFormatter: SchemaErrorFormatter = (errors) => {
  const message = errors.map(({ message }) => message).join('\n');
  return new Error(message);
};

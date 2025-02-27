import { FastifyPluginAsync } from 'fastify';
import mongoose from 'mongoose';

import { ENV_VARS } from '@constants';
import { env } from '@utils';

const uri = env(ENV_VARS.MONGODB_URI);

const mongoosePlugin: FastifyPluginAsync = async () => {
  try {
    await mongoose.connect(uri);
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

export default mongoosePlugin;

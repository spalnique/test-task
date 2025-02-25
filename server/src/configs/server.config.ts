import { ENV_VARS } from '@constants';
import { env } from '@utils';

export const serverConfig = { port: Number(env(ENV_VARS.PORT)) || 4001 };

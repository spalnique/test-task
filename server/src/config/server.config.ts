import { ENV_VARS } from '@constants';
import { env } from '@utils';

export default { port: Number(env(ENV_VARS.PORT)) || 4001 };

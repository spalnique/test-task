import { ENV_VARS } from '@constants';
import { env } from '@utils';

export default {
  headers: {
    Authorization: `Bearer ${env(ENV_VARS.OPENAI_API_KEY)}`,
    'OpenAI-Beta': 'realtime=v1',
  },
};

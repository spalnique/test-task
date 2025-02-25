import { ENV_VARS } from '@constants';
import { env } from '@utils';

export const realtimeAPIConfig = {
  headers: {
    Authorization: `Bearer ${env(ENV_VARS.OPENAI_API_KEY)}`,
    'OpenAI-Beta': 'realtime=v1',
  },
};

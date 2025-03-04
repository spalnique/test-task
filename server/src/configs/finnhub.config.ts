import { CreateAxiosDefaults } from 'axios';

import { ENV_VARS, FINNHUB_API_URL } from '@constants';
import { env } from '@utils';

export const finnhubConfig: CreateAxiosDefaults = {
  baseURL: FINNHUB_API_URL,
  headers: {
    'X-Finnhub-Token': env(ENV_VARS.FINNHUB_API_KEY),
    'Content-Type': 'application/json',
  },
};

import NodeCache from 'node-cache';

import { Provider } from '@nestjs/common';

import { CACHE_TOKEN } from '../tokens';

export const cacheProvider: Provider = {
  provide: CACHE_TOKEN,
  useFactory: () => new NodeCache({ stdTTL: 300, checkperiod: 10 }),
};

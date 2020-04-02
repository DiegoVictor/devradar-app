import ExpressBruteFlexible from 'rate-limiter-flexible/lib/ExpressBruteFlexible';

import {
  free_retries,
  min_wait,
  max_wait,
  lifetime,
  prefix,
} from '../../config/bruteforce.json';
import redis from '../../database/redis';

let opts = {};
let store_type = 'MEMORY';
if (process.env.NODE_ENV !== 'test') {
  store_type = 'REDIS';
  opts = {
    freeRetries: free_retries,
    minWait: min_wait,
    maxWait: max_wait,
    lifetime,
    prefix,
    storeClient: redis,
  };
}

export default new ExpressBruteFlexible(
  ExpressBruteFlexible.LIMITER_TYPES[store_type],
  opts
);

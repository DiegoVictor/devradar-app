import ExpressBruteFlexible from 'rate-limiter-flexible/lib/ExpressBruteFlexible';

import redis from '../database/redis';

export default function BruteForce(opts) {
  if (process.env.NODE_ENV !== 'test') {
    return new ExpressBruteFlexible(ExpressBruteFlexible.LIMITER_TYPES.REDIS, {
      ...opts,
      storeClient: redis,
    });
  }

  return new ExpressBruteFlexible(
    ExpressBruteFlexible.LIMITER_TYPES.MEMORY,
    opts
  );
}

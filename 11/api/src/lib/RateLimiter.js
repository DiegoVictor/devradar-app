import { RateLimiterRedis, RateLimiterMemory } from 'rate-limiter-flexible';

import redis from '../database/redis';

export default function RateLimiter(opts) {
  if (process.env.NODE_ENV === 'test') {
    return new RateLimiterMemory(opts);
  }

  return new RateLimiterRedis({
    redis,
    ...opts,
  });
}

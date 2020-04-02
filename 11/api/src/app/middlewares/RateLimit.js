import RateLimiter from '../../lib/RateLimiter';
import {
  block_duration_in_seconds,
  requests_limit,
} from '../../config/rate_limit.json';

const rate_limiter = new RateLimiter({
  duration: block_duration_in_seconds,
  points: requests_limit,
});

export default async (req, res, next) => {
  try {
    await rate_limiter.consume(req.ip);
    return next();
  } catch (err) {
    return res.status(429).json({
      error: {
        message: 'Too Many Requests',
      },
    });
  }
};

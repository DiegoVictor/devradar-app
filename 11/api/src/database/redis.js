import redis from 'redis';

export default redis.createClient({
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
});

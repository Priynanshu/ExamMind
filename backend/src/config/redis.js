import Redis from 'ioredis';

let redisClient = null;

const connectRedis = () => {
  redisClient = new Redis({
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT) || 6379,
    password: process.env.REDIS_PASSWORD || undefined,
    retryStrategy: (times) => {
      if (times > 3) {
        console.warn('Redis connection failed, running without cache');
        return null; 
      }
      return Math.min(times * 200, 1000);
    },
    lazyConnect: true,
  });

  redisClient.on('connect', () => console.log('Redis connected'));
  redisClient.on('error', (err) => console.warn(`Redis error: ${err.message}`));

  redisClient.connect().catch(() => {
    console.warn('Redis unavailable — caching disabled');
  });

  return redisClient;
};

const getRedisClient = () => redisClient;

export { connectRedis, getRedisClient };

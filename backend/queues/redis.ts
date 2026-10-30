import { Redis } from 'ioredis';

const redisUrl = process.env.REDIS_URL;
if (!redisUrl)
  throw new Error('Missing Redis Url');

export const connection = new Redis(redisUrl, {
  maxRetriesPerRequest: null
})
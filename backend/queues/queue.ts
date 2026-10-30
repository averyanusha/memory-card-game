import { Queue } from 'bullmq';
import { connection } from './redis.js';

export const imageQueue = new Queue('images', { 
  connection,
  defaultJobOptions: {
    removeOnComplete: { age: 3600, count: 100},
    removeOnFail: { age: 86400 }
  }
});
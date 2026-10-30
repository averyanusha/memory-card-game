import { Queue } from 'bullmq';
import { connection } from './redis.js';

export const imageQueue = new Queue('images', {connection});
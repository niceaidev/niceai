import type { Redis } from 'ioredis';
import { ThrottlerStorageRedisService } from '@nest-lab/throttler-storage-redis';

export const createStorage = (redis: Redis) => {
  console.log('createStorage', process.env.NODE_ENV);
  if (process.env.NODE_ENV === 'development') {
    return null;
  }
  return new ThrottlerStorageRedisService(redis);
};

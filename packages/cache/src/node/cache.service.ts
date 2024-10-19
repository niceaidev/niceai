import type { Redis } from 'ioredis';
import { CacheClosure, cache, Cache } from '..';

export type CacheServiceOptions = Partial<{
  prefix: string;
}>;

export class CacheService {
  protected cache: Cache;

  constructor(redis: Redis, opts: CacheServiceOptions = {}) {
    this.cache = cache(redis, opts);
  }

  getPrefix() {
    return this.cache.getPrefix();
  }

  async set(key: string, value: unknown, seconds?: number) {
    return this.cache.set(key, value, seconds);
  }

  putMany(values: Record<string, unknown>, seconds?: number) {
    return this.cache.putMany(values, seconds);
  }

  async rememberForever<T>(key: string, fn: () => Promise<T>): Promise<T> {
    return this.cache.rememberForever<T>(key, fn);
  }

  async remember<T>(
    key: string,
    fn?: CacheClosure<T>,
    seconds?: number,
  ): Promise<T | null> {
    return await this.cache.remember<T>(key, fn, seconds);
  }

  async increment(key: string, value = 1) {
    return this.cache.increment(key, value);
  }

  async decrement(key: string, value = 1) {
    return this.cache.decrement(key, value);
  }

  async forever(key: string, value: unknown) {
    return this.cache.forever(key, value);
  }

  async forget(key: string): Promise<boolean> {
    return this.cache.forget(key);
  }

  async get<T>(key: string, defaultVal?: T): Promise<T | null> {
    return this.cache.get<T>(key, defaultVal);
  }

  async del(key: string): Promise<boolean> {
    return this.cache.delete(key);
  }

  async deleteMultiple(keys: string[]): Promise<boolean> {
    return this.cache.deleteMultiple(keys);
  }

  async has(key: string): Promise<boolean> {
    return this.cache.has(key);
  }

  async pull<T>(key: string) {
    return this.cache.pull<T>(key);
  }

  async put<T>(key: string, value: T, seconds?: number) {
    return this.cache.put(key, value, seconds);
  }

  async ttl(key: string): Promise<number | null> {
    return this.cache.ttl(key);
  }

  async flush(): Promise<boolean> {
    return this.cache.flush();
  }

  async getMultiple(keys: string[]): Promise<any> {
    return this.cache.getMultiple(keys);
  }

  async add<T>(key: string, value: T, seconds?: number) {
    return this.cache.add<T>(key, value, seconds);
  }
}

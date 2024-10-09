import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import type { Redis } from 'ioredis';
import { CacheClosure, CacheStore } from '@niceai/cache';

@Injectable()
export class CacheService implements OnModuleDestroy, OnModuleInit {
  protected store: CacheStore;

  protected readonly cachePrefix: string;

  constructor(redis: Redis, opts: { prefix?: string } = {}) {
    this.store = new CacheStore(redis, opts);
  }

  async onModuleInit() {
    await this.store.connect();
  }

  getPrefix() {
    return this.store.getPrefix();
  }

  async set(key: string, value: unknown, seconds?: number) {
    return this.store.set(key, value, seconds);
  }

  putMany(values: Record<string, unknown>, seconds?: number) {
    return this.store.putMany(values, seconds);
  }

  async rememberForever<T>(key: string, fn: () => Promise<T>): Promise<T> {
    return this.store.rememberForever<T>(key, fn);
  }

  async remember<T>(
    key: string,
    fn?: CacheClosure<T>,
    seconds?: number,
  ): Promise<T | null> {
    const now = Date.now();
    const res = await this.store.remember(key, fn, seconds);
    console.log(Date.now() - now);
    return res;
  }

  async increment(key: string, value = 1) {
    return this.store.increment(key, value);
  }

  async decrement(key: string, value = 1) {
    return this.store.decrement(key, value);
  }

  async forever(key: string, value: unknown) {
    return this.store.forever(key, value);
  }

  async forget(key: string): Promise<boolean> {
    return this.store.forget(key);
  }

  async get<T>(key: string, defaultVal?: T): Promise<T | null> {
    return this.store.get<T>(key, defaultVal);
  }

  async del(key: string): Promise<boolean> {
    return this.store.delete(key);
  }

  async deleteMultiple(keys: string[]): Promise<boolean> {
    return this.store.deleteMultiple(keys);
  }

  async has(key: string): Promise<boolean> {
    return this.store.has(key);
  }

  async pull<T>(key: string) {
    return this.store.pull<T>(key);
  }

  async put<T>(key: string, value: T, seconds?: number) {
    return this.store.put(key, value, seconds);
  }

  async ttl(key: string): Promise<number | null> {
    return this.store.ttl(key);
  }

  async flush(): Promise<boolean> {
    return this.store.flush();
  }

  async getMultiple(keys: string[]): Promise<any> {
    return this.store.getMultiple(keys);
  }

  async add<T>(key: string, value: T, seconds?: number) {
    return this.store.add<T>(key, value, seconds);
  }

  onModuleDestroy(): void {
    this.store.disconnect();
  }
}

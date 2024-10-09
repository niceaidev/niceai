import type { Redis } from 'ioredis';
import { isNil } from 'lodash';
import transform from 'lodash/transform';
import { serialize, unserialize } from './utils/json';

// Define the type for the cache closure function
export type CacheClosure<T> = () => Promise<T> | T;

// Define the constant for successful Redis operation response
const REDIS_SUCCESS = 'OK';

/**
 * Class representing a cache store using Redis.
 */
export class CacheStore {
  protected prefix = ''; // Prefix for cache keys
  protected readonly redis: Redis; // Redis client instance

  /**
   * Construct a new instance of the CacheStore.
   *
   * @param redis The Redis client instance to use.
   * @param opts Configuration options, including an optional prefix for cache keys.
   */
  constructor(redis: Redis, opts: { prefix?: string } = {}) {
    this.prefix = opts.prefix;
    this.redis = redis;
  }

  /**
   * Get the current cache key prefix.
   *
   * @returns The current cache key prefix.
   */
  getPrefix(): string {
    return this.prefix || '';
  }

  /**
   * Set the cache key prefix.
   *
   * This method allows specifying a prefix for cache keys, to be used in subsequent cache operations.
   * It can be used for organizing cache data or implementing namespace separation.
   *
   * @param prefix The cache key prefix, serving as a common prefix for subsequent cache operations.
   */
  public setPrefix(prefix: string) {
    this.prefix = prefix;
  }

  // Connect to the Redis server
  public connect() {
    return this.redis.connect();
  }

  // Disconnect from the Redis server
  public disconnect() {
    return this.redis.disconnect();
  }

  // Get the Redis client instance
  getRedis() {
    return this.redis;
  }

  /**
   * Set a cache value with an optional expiration time.
   *
   * @param key The cache key.
   * @param value The value to cache.
   * @param seconds Optional expiration time in seconds.
   * @returns Promise resolving to a boolean indicating success.
   */
  async set(key: string, value: unknown, seconds?: number): Promise<boolean> {
    console.log(this.getSeconds(seconds));
    const cacheKey = this.getKey(key);
    const res = await this.redis.set(cacheKey, this.serialize(value));
    const ttl = this.getSeconds(seconds);
    if (ttl) {
      await this.redis.expire(cacheKey, ttl);
    }
    return res === REDIS_SUCCESS;
  }

  /**
   * Retrieve a value from the cache, or execute a function to set it if not present, with no expiration.
   *
   * @param key The cache key.
   * @param fn The function to execute if the cache key is not present.
   * @returns Promise resolving to the cached value or the result of the function.
   */
  async rememberForever<T>(key: string, fn: CacheClosure<T>): Promise<T> {
    return await this.remember<T>(this.getKey(key), fn);
  }

  /**
   * Check if a cache key is missing.
   *
   * @param key The cache key to check.
   * @returns Promise resolving to a boolean indicating if the key is missing.
   */
  async missing(key: string): Promise<boolean> {
    const res = await this.has(key);
    return !res;
  }

  /**
   * Retrieve a value from the cache, or execute a function to set it if not present.
   *
   * @param key The cache key.
   * @param fn Optional function to execute if the cache key is not present.
   * @param seconds Optional expiration time in seconds.
   * @returns Promise resolving to the cached value, the result of the function, or null.
   */
  async remember<T>(
    key: string,
    fn?: CacheClosure<T>,
    seconds?: number,
  ): Promise<T | null> {
    try {
      const value = await this.get<T>(key);
      if (value) return value;
      if (!fn) return null;
      const res = await fn();
      await this.set(key, res, seconds);
      return res;
    } catch (error) {
      return null;
    }
  }

  /**
   * Increment the value of a cache key.
   *
   * @param key The cache key.
   * @param value The amount to increment by.
   * @returns Promise resolving to the new value.
   */
  async increment(key: string, value = 1) {
    const res = await this.redis.incrby(this.getKey(key), value);
    return res as number;
  }

  /**
   * Decrement the value of a cache key.
   *
   * @param key The cache key.
   * @param value The amount to decrement by.
   * @returns Promise resolving to the new value.
   */
  async decrement(key: string, value = 1) {
    const cacheKey = this.getKey(key);
    const res = await this.redis.decrby(cacheKey, value);
    return res as number;
  }

  /**
   * Set a cache value with no expiration.
   *
   * @param key The cache key.
   * @param value The value to cache.
   * @returns Promise resolving to a boolean indicating success.
   */
  async forever(key: string, value: unknown) {
    const res = await this.set(key, value);
    return res;
  }

  /**
   * Retrieve multiple values from the cache.
   *
   * @param keys An array of cache keys.
   * @param defaultVal The default value to return if a key is missing.
   * @returns Promise resolving to an object mapping keys to their values or the default value.
   */
  async getMultiple<T>(
    keys: string[],
    defaultVal: T | null = null,
  ): Promise<Record<string, T | null>> {
    const values = await this.redis.mget(keys.map(key => this.getKey(key)));
    return values.reduce(
      (results, value, idx) => {
        results[keys[idx]] = this.unserialize<T>(value) ?? defaultVal;
        return results;
      },
      {} as Record<string, T | null>,
    );
  }

  /**
   * Remove a cache key.
   *
   * @param key The cache key to remove.
   * @returns Promise resolving to a boolean indicating success.
   */
  async forget(key: string): Promise<boolean> {
    return await this.delete(key);
  }

  /**
   * Retrieve a value from the cache.
   *
   * @param key The cache key.
   * @param defaultVal The default value to return if the key is missing.
   * @returns Promise resolving to the cached value or the default value.
   */
  async get<T>(key: string, defaultVal: T | null = null): Promise<T | null> {
    const value = await this.redis.get(this.getKey(key));
    return !isNil(value) ? this.unserialize<T>(value) : defaultVal;
  }

  /**
   * Remove a cache key.
   *
   * @param key The cache key to remove.
   * @returns Promise resolving to a boolean indicating success.
   */
  async delete(key: string): Promise<boolean> {
    const res = await this.redis.del(this.getKey(key));
    return res === 1;
  }

  /**
   * Remove all cache keys.
   *
   * @returns Promise resolving to a boolean indicating success.
   */
  clear(): Promise<boolean> {
    return this.flush();
  }

  /**
   * Remove multiple cache keys.
   *
   * @param keys An array of cache keys to remove.
   * @returns Promise resolving to a boolean indicating success.
   */
  async deleteMultiple(keys: string[]): Promise<boolean> {
    const results = await Promise.all(keys.map(this.delete));
    return results.every(Boolean);
  }

  /**
   * Check if a cache key exists.
   *
   * @param key The cache key to check.
   * @returns Promise resolving to a boolean indicating if the key exists.
   */
  async has(key: string): Promise<boolean> {
    const exists = await this.redis.exists(key);
    return exists === 1;
  }

  /**
   * Retrieve and remove a value from the cache.
   *
   * @param key The cache key.
   * @returns Promise resolving to the cached value, or null if not found.
   */
  async pull<T>(key: string) {
    const cacheKey = this.getKey(key);
    const value = await this.redis.get(cacheKey);
    if (value) {
      await this.forget(cacheKey);
      return this.unserialize<T>(value);
    }
    return null;
  }

  /**
   * Set a cache value with an optional expiration.
   *
   * @param key The cache key.
   * @param value The value to cache.
   * @param seconds Optional expiration time in seconds.
   * @returns Promise resolving to a boolean indicating success.
   */
  async put(key: string, value: unknown, seconds?: number) {
    const cacheKey = this.getKey(key);
    const res = await this.redis.set(cacheKey, this.serialize(value));
    const ttl = this.getSeconds(seconds);
    if (ttl) {
      await this.redis.expire(cacheKey, ttl);
    }
    return res === REDIS_SUCCESS;
  }

  /**
   * Set multiple cache values with an optional expiration.
   *
   * @param values An object mapping keys to their values.
   * @param seconds Optional expiration time in seconds.
   * @returns Promise resolving to a boolean indicating success.
   */
  async putMany(values: Record<string, unknown>, seconds?: number) {
    const results = Object.entries(values).map(async ([key, value]) =>
      this.put(key, value, seconds),
    );
    return results.every(Boolean);
  }

  /**
   * Get the remaining time-to-live (TTL) of a cache key.
   *
   * @param key The cache key.
   * @returns Promise resolving to the TTL in seconds, or null if the key does not exist.
   */
  async ttl(key: string): Promise<number | null> {
    return this.redis.ttl(key);
  }

  /**
   * Remove all cache keys.
   *
   * @returns Promise resolving to a boolean indicating success.
   */
  async flush(): Promise<boolean> {
    const res = await this.redis.flushdb();
    return res === REDIS_SUCCESS;
  }

  /**
   * Retrieve multiple values from the cache.
   *
   * @param keys An array of cache keys.
   * @returns Promise resolving to an object mapping keys to their values.
   */
  async many(keys: Record<string, unknown>) {
    const values = await this.redis.mget(...Object.keys(keys).map(this.getKey));
    return transform(
      values,
      (results, value, key) => {
        results[key] = this.unserialize(value);
      },
      keys,
    );
  }

  /**
   * Add a value to the cache only if it does not already exist.
   *
   * @param key The cache key.
   * @param value The value to cache.
   * @param seconds Optional expiration time in seconds.
   * @returns {Promise<boolean>} Promise resolving to a boolean indicating if the operation was successful.
   */
  async add<T>(key: string, value: T, seconds?: number): Promise<boolean> {
    const exist = await this.has(key);
    if (exist) return false;
    return await this.set(key, value, seconds);
  }

  /**
   * Serialize the value.
   *
   * @param value - The value to be serialized, with a type of unknown, can be any type of data.
   * @returns Returns the serialized string.
   */
  serialize(value: unknown): string | number {
    return serialize(value);
  }

  /**
   * Unserialize the value.
   *
   * This function takes a string representation of a serialized value, and returns the unserialized data.
   * If the input string is empty or null, the function returns null.
   *
   * @param value The serialized data string.
   * @returns The unserialized data, or null if the input is invalid.
   */
  unserialize<T>(value: string): T | null {
    return unserialize<T>(value);
  }

  // Generate the actual cache key by combining the prefix and the given key
  protected getKey(key: string): string {
    return this.getPrefix() + key;
  }

  /**
   * Get the number of seconds for cache expiration.
   *
   * @param seconds The specified expiration time, or undefined.
   * @returns The expiration time in seconds, or 0 if not specified.
   */
  private getSeconds(seconds?: number): number {
    return Number(seconds > 0 ? seconds : 0);
  }
}

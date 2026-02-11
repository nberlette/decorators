// deno-lint-ignore-file no-explicit-any
/**
 * This module contains the types and interfaces used for configuring the
 * options of the LRU cache decorator.
 *
 * @module options
 */

import type { Overrides } from "./overrides.ts";
import type { CacheEntry, CacheKey, ExtendedCacheEntry } from "./types.ts";

/**
 * Eviction strategy for the {@linkcode lru} decorator.
 *
 * - `"passive"`: Expired entries are removed lazily on access.
 * - `"active"`: Expired entries are removed actively using timers.
 *
 * @category Types
 */
export type EvictionStrategy = "passive" | "active";

// deno-lint-ignore ban-types
export type strings = string & {};

/**
 * Custom function to generate a cache key from the method arguments.
 *
 * @category Types
 */
export type Keygen<
  This extends object = any,
  Args extends readonly any[] = any[],
> = (this: This, ...args: Args) => CacheKey | strings;

/**
 * Custom transformer function for post-processing cached values. This is the
 * type signature for the `transform` option in the {@linkcode lru} decorator.
 *
 * @template I The input type of the cached value.
 * @template [O=I] The output type of the transformed value.
 *
 * @category Types
 */
export type Transformer<I, O = I> = (
  value: I,
  key: CacheKey,
  entry: CacheEntry<I>,
) => O;

/**
 * Options for configuring the {@linkcode lru} decorator.
 *
 * @category Options
 */
export interface Options<
  This extends object = object,
  Args extends readonly unknown[] = any[],
  Return = any,
> {
  /**
   * Controls the strategy for removing entries from the cache when they have
   * expired.
   *
   * - `"passive"`: Expired entries are removed lazily on access.
   * - `"active"`: Expired entries are removed actively using timers.
   *
   * @default {"passive"}
   */
  eviction?: EvictionStrategy | undefined;
  /**
   * Custom function to generate a cache key from the method arguments.
   *
   * @default {defaultKey} (uses JSON.stringify)
   */
  key?: Keygen<This, Args> | undefined;
  /**
   * Maximum number of entries to store in the cache.
   *
   * @default {128}
   */
  maxSize?: number | undefined;
  /**
   * Custom callback to be invoked whenever an entry is evicted from the cache.
   * This can be used to perform additional cleanup or logging.
   *
   * @example
   * ```ts
   * import { lru } from "@decorators/lru";
   *
   * class Database {
   *   @lru({ ttl: 5e3, onEvict: (k, v) => console.log(`evicted ${k}: ${v}`) })
   *   transaction_id(key: string): string {
   *     return `${key}_${Math.random().toString(36).slice(2)}`;
   *   }
   * }
   *
   * const db = new Database();
   *
   * db.transaction_id("user_1"); // "user_1_cdcu78j"
   * db.transaction_id("user_1"); // "user_1_cdcu78j"
   * // wait 5 seconds
   * db.transaction_id("user_2"); // "user_2_3j8d7k9"
   * // Logs: "evicted user_1_cdcu78j"
   * ```
   */
  onEvict?(
    this: This,
    value: Return,
    key: CacheKey,
    entry: CacheEntry<Return>,
  ): void;

  /**
   * Custom callback to be invoked whenever an entry is refreshed in the cache.
   * This can be used to perform additional actions or logging.
   *
   * @example
   * ```ts
   * import { lru } from "@decorators/lru";
   *
   * class Database {
   *   @lru({ ttl: 5e3, onRefresh: (k, v) => console.log(`refreshed ${k}: ${v}`) })
   *   transaction_id(key: CacheKey): string {
   *     return `${key}_${Math.random().toString(36).slice(2)}`;
   *   }
   * }
   *
   * const db = new Database();
   *
   * db.transaction_id("user_1"); // "user_1_cdcu78j"
   * db.transaction_id("user_1"); // "user_1_cdcu78j"
   * // wait 5 seconds
   * db.transaction_id("user_2"); // "user_2_3j8d7k9"
   * // Logs: "refreshed user_1_cdcu78j"
   * ```
   */
  onRefresh?(
    this: This,
    value: Return,
    key: CacheKey,
    entry: CacheEntry<Return>,
  ): void;

  // /**
  //  * Custom predicate function to determine whether a cache entry should be
  //  * evicted. This can be used to implement custom eviction policies.
  //  *
  //  * @example
  //  * ```ts
  //  * import { lru } from "@decorators/lru";
  //  *
  //  * class MyService {
  //  *   @lru({
  //  *     key: (url) => url.toString(),
  //  *     shouldEvict(key, value, entry) {
  //  *       return entry.age > 10_000
  //  *     },
  //  *   })
  //  *   fetch(url: string | URL): Promise<Response> {
  //  *     return globalThis.fetch(url);
  //  *   }
  //  * }
  //  * ```
  //  */
  // shouldEvict?(
  //   this: This,
  //   entry: CacheEntry<Return>,
  // ): boolean;

  // /**
  //  * Optional function to be called when the cache is cleared. This can be used
  //  * to perform additional cleanup or logging.
  //  *
  //  * @example
  //  * ```ts
  //  * import { lru } from "@decorators/lru";
  //  *
  //  * class MyService {
  //  *   @lru({ onClear: () => console.log("Cache cleared!") })
  //  *   fetch(url: string | URL): Promise<Response> {
  //  *     return globalThis.fetch(url);
  //  *   }
  //  * }
  //  * ```
  //  */
  // onClear?(this: This): void;

  /**
   * Optional function to be called on a cache hit. This can be used to
   * perform additional actions or logging.
   */
  onHit?(
    this: This,
    value: Return,
    key: CacheKey,
    entry: CacheEntry<Return>,
  ): void;

  /**
   * Optional function to be called on a cache miss. This can be used to
   * perform additional actions or logging.
   */
  onMiss?(this: This, key: CacheKey): void;

  /**
   * Optional inspection function which is called whenever a cache entry is
   * accessed, and invoked with the key, value, entry object, and the cache
   * instance itself as arguments. The function and its return value have no
   * effect on the cache itself, it is purely for passive inspection.
   */
  inspect?(
    this: This,
    entry: ExtendedCacheEntry<Return>,
  ): void;

  /**
   * Custom API overrides for the cache implementation. This is primarily for
   * dependency injection and testing purposes.
   *
   * **Warning**: This option is intended for advanced use-cases and testing
   * purposes. It should be used with caution, and only if you really know how
   * it works. Incorrect usage **will** break the caching mechanism entirely.
   */
  overrides?: Overrides | undefined;

  /**
   * Optional pre-processing function, which can be used to transform values
   * **before** they are stored in the cache, and after they are computed by
   * the original (memoized) method.
   *
   * This can be used to implement advanced cache behaviors which require
   * the values to be transformed or otherwise processed before they are
   * stored in the cache. For example, you might want to compress the value
   * before storing it, or convert it to a different format.
   *
   * @remarks
   * **Note**: It's important to note that due to the current design of the
   * decorators proposal, it's not possible to transform the type of the value
   * to something that is not assignable to the original type. This limitation
   * was an intentional decision by the decorators proposal authors, but it has
   * received some criticism and is being considered for future revisions. For
   * now, however, compile-time type transformations are not supported.
   *
   * This means that the `prepare` function must return the same type of value
   * as it receives, and must be compatible with the original method signature.
   * That being said, it _is_ possible to transform these values at runtime to
   * any type you want (theoretically), due to JavaScript's dynamic nature. But
   * the TypeScript compiler will not be able to infer this, and will either
   * raise a compiler error or simply fail to recognize the transformed type.
   * @example
   * ```ts
   * import { lru } from "@decorators/lru";
   *
   * class MyService {
   *   @lru({
   *     prepare: async (res) => {
   *       const clone = (await res).clone();
   *       // update the response headers
   *       clone.headers.set("x-lru-cache", "true");
   *       return clone;
   *     },
   *     // this option is critical when we are caching an HTTP Response.
   *     // if we don't clone it before we return it, it will be consumed
   *     // and become totally useless after the first access.
   *     transform: async (res) => (await res).clone(),
   *   })
   *   fetch(url: string | URL): Promise<Response> {
   *     return globalThis.fetch(url);
   *   }
   * }
   * ```
   */
  prepare?: Transformer<Return> | undefined;

  /**
   * Optional post-processing function, which can be used to transform values
   * after they are retrieved from the cache, but before they are returned.
   *
   * This can be used to implement more advanced cache behaviors, such as
   * caching an HTTP response, which requires cloning the cached value before
   * returning it. Without a transform function, the cached value would only be
   * valid for a single use, and any subsequent access would throw an error due
   * to the response being consumed.
   *
   * @remarks
   * **Note**: It's important to note that due to the current design of the
   * decorators proposal, it's not possible to transform the type of the value
   * to something that is not assignable to the original type. This limitation
   * was an intentional decision by the decorators proposal authors, but it has
   * received some criticism and is being considered for future revisions. For
   * now, however, compile-time type transformations are not supported.
   *
   * This means that the transform function must return the same type of value
   * as it receives, and must be compatible with the original method signature.
   * That being said, it _is_ possible to transform these values at runtime to
   * any type you want (theoretically), due to JavaScript's dynamic nature. But
   * the TypeScript compiler will not be able to infer this, and will either
   * raise a compiler error or simply fail to recognize the transformed type.
   * @example
   * ```ts
   * import { lru } from "@decorators/lru";
   *
   * class FetchService {
   *   constructor(protected init?: RequestInit) {}
   *
   *   @lru({
   *     key: (url) => url.toString(),
   *     transform: async (res) => (await res).clone(),
   *     ttl: 5_000, // cache entries expire after 5 seconds
   *   })
   *   fetch(url: string | URL): Promise<Response> {
   *     return globalThis.fetch(url, this.init);
   *   }
   * }
   * ```
   */
  transform?: Transformer<Return> | undefined;

  /**
   * Optional time-to-live (TTL) in milliseconds for each cache entry. If set,
   * cache entries that haven't been accessed within the provided time window
   * will be removed from the cache.
   *
   * @default {0} (entries do not expire)
   */
  ttl?: number | undefined;
}

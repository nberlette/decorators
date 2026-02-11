/**
 * This module provides the {@linkcode LRU} cache which the {@linkcode lru}
 * decorator uses as its default mechanism for storing cached values.
 *
 * @example
 * ```ts
 * import { LRU } from "@decorators/lru/cache";
 *
 * const cache = new LRU<string, number>(2);
 *
 * cache.set("a", 1);
 * cache.set("b", 2);
 * cache.set("c", 3); // "a" is evicted
 * console.log(cache.get("a")); // undefined
 * ```
 * @module cache
 */
import type { MapLike } from "./types.ts";

const kInspect: unique symbol = Symbol.for("Deno.customInspect");

/**
 * A generic Least Recently Used (LRU) cache.
 *
 * This class implements a simple LRU cache using a JavaScript Map.
 * When a new key is inserted and the cache is full, the oldest key is
 * evicted.
 *
 * @example
 * ```ts
 * import { LRU } from "@decorators/lru/cache";
 *
 * const cache = new LRU<string, number>(3);
 * cache.set("a", 1);
 * cache.set("b", 2);
 * cache.set("c", 3);
 * console.log(cache.get("a")); // 1 (and "a" becomes most-recent)
 * cache.set("d", 4); // "b" is evicted (the oldest)
 * console.log(cache.has("b")); // false
 * ```
 *
 * @category Caching
 * @tags LRU, cache
 */
export class LRU<K, V> implements MapLike<K, V> {
  #cache = new Map<K, V>();
  #maxSize = 128;

  /**
   * Creates an instance of LRU.
   *
   * @param maxSize - The maximum number of entries to store.
   * @returns A new LRU instance.
   * @example
   * ```ts
   * import { LRU } from "@decorators/lru/cache";
   *
   * const cache = new LRU<string, number>(128);
   * ```
   */
  constructor(maxSize?: number) {
    if (maxSize != null) this.#maxSize = +maxSize >>> 0;

    Object.defineProperty(this, kInspect, {
      value: this[kInspect].bind(this),
      enumerable: false,
      configurable: true,
      writable: false,
    });
  }

  /** Returns the number of entries currently stored in the cache. */
  get size(): number {
    return this.#cache.size;
  }

  /** Returns the maxSize of this cache instance. */
  get maxSize(): number {
    return this.#maxSize;
  }

  /**
   * Retrieves a value from the cache and updates its recency.
   *
   * @param key - The key to retrieve.
   * @returns The cached value if present; otherwise, undefined.
   * @example
   * ```ts
   * import { LRU } from "@decorators/lru/cache";
   *
   * const cache = new LRU<string, number>(128);
   *
   * const value = cache.get("a");
   *
   * if (value !== undefined) console.log("Cached:", value);
   * ```
   */
  get(key: K): V | undefined {
    if (this.#cache.has(key)) {
      const value = this.#cache.get(key)!;
      // update recency: remove and reinsert
      this.#cache.delete(key);
      this.#cache.set(key, value);
      return value;
    }
  }

  /**
   * Checks if a key exists in the cache.
   *
   * @param key The key to check.
   * @returns `true` if the key is in the cache; otherwise, `false`.
   * @example
   * ```ts
   * import { LRU } from "@decorators/lru/cache";
   *
   * const cache = new LRU<string, number>(128);
   *
   * if (cache.has("a")) {
   *   console.log("Key 'a' exists!");
   * }
   * ```
   */
  has(key: K): boolean {
    return this.#cache.has(key);
  }

  /**
   * Inserts or updates a key-value pair in the cache. If the cache exceeds its
   * maxSize, the oldest entry is removed.
   *
   * @param key - The key to insert/update.
   * @param value - The value to associate with the key.
   * @returns This LRU instance.
   *
   * @example
   * ```ts
   * import { LRU } from "@decorators/lru/cache";
   *
   * const cache = new LRU<string, number>(128);
   *
   * cache.set("b", 2);
   * ```
   */
  set(key: K, value: V): this {
    if (this.#cache.has(key)) {
      this.#cache.delete(key);
    } else if (this.#cache.size >= this.#maxSize) {
      // Remove the least-recently used (first) key.
      const oldestKey = this.#cache.keys().next().value;
      if (typeof oldestKey !== "undefined") this.#cache.delete(oldestKey);
    }
    this.#cache.set(key, value);
    return this;
  }

  /**
   * Removes a key from the cache.
   *
   * @param key - The key to remove.
   * @returns `true` if the key was removed; otherwise, `false`.
   *
   * @example
   * ```ts
   * import { LRU } from "@decorators/lru/cache";
   *
   * const cache = new LRU<string, number>(128);
   *
   * cache.set("a", 1);
   * cache.delete("a"); // true
   * cache.delete("a"); // false
   * ```
   */
  delete(key: K): boolean {
    return this.#cache.delete(key);
  }

  /** Clears the cache, removing all entries. */
  clear(): void {
    this.#cache.clear();
  }

  /** @internal */
  [kInspect](
    inspect: (value: unknown, options: Deno.InspectOptions) => string,
    options: Deno.InspectOptions,
  ): string {
    const name = this.constructor.name || "LRU";
    const text = inspect(this.#cache, options);
    const label = `${name}(${this.size}/${this.maxSize})`;
    return text.replace(/\bMap\s*\(\d+\)/, label);
  }
}

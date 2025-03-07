/**
 * This module provides the types and default values for the custom overrides
 * capability of the `@decorators/lru` library. It allows advanced users to
 * customize the internal APIs used by the caching mechanisms, giving a much
 * higher degree of flexibility and control over the caching behavior.
 *
 * This is especially useful for testing, where you might want to inject
 * different implementations of the cache or storage mechanisms.
 *
 * @module overrides
 */
import { LRU } from "./lru_cache.ts";
import type {
  CacheContainer,
  LruLikeConstructor,
  MapLikeConstructor,
  TimeProvider,
} from "./types.ts";

/**
 * Custom overrides for the {@linkcode lru} decorator, allowing for dependency
 * injection and testing of the cache implementation.
 *
 * - `Date`    - {@linkcode TimeProvider} for time-based operations.
 * - `LRU`     - {@linkcode LruLikeConstructor} override for the `LRU` class
 * - `Map`     - {@linkcode MapLikeConstructor} override for the `Map` class
 * - `WeakMap` - {@linkcode MapLikeConstructor} override for `WeakMap`
 * - `storage` - {@linkcode CacheContainer} override for the storage instance.
 *
 * **Warning**: These options are intended for advanced use-cases and should be
 * used with caution, as they can easily break the decorator if not implemented
 * correctly. It's usually best to leave these as the default values.
 *
 * @category Options
 * @tags Overrides
 */
export interface Overrides<This extends object = object> {
  /**
   * The LRU cache implementation to use. Defaults to the {@link LRU} class
   * included with this library.
   *
   * @default {LRU}
   */
  LRU?: LruLikeConstructor | undefined;
  /**
   * The Map implementation to use. Defaults to the global `Map` class.
   *
   * @default {globalThis.Map}
   */
  Map?: MapLikeConstructor | undefined;
  /**
   * The WeakMap implementation to use. Defaults to the global `WeakMap` class.
   *
   * @default {globalThis.WeakMap}
   */
  WeakMap?: MapLikeConstructor | undefined;
  /**
   * The `Date` constructor to use for time-based operations.
   *
   * @default {globalThis.Date}
   */
  Date?: TimeProvider | undefined;
  /**
   * Custom storage implementation for the cache. This is a multi-layered map
   * structure used to store the cache containers for each class constructor.
   *
   * The default implementation uses a WeakMap for the outer layer, a WeakMap
   * for the inner layer, a Map for the property-to-LRU mapping, and (finally!)
   * the actual LRU cache for the decorated method.
   *
   * The structure looks like this:
   * ```ts ignore
   * WeakMap<object, // <-------- outer layer (key: class constructor)
   *   WeakMap<Instance, // <---- inner layer (key: class instances)
   *     Map<PropertyKey,  // <-- prop-to-LRU (key: property names)
   *       LRU<string, any> // <- LRU cache (key: keygen result)
   *     >,
   *   >,
   * >
   * ```
   */
  storage?: CacheContainer<This> | undefined;
}

const WeakMap = globalThis.WeakMap;
const Map = globalThis.Map;
const Date = globalThis.Date;

/** @internal */
const storage: CacheContainer = new WeakMap();

export const defaults = {
  storage: storage as CacheContainer,
  WeakMap: WeakMap as MapLikeConstructor,
  Map: Map as MapLikeConstructor,
  Date: Date as TimeProvider,
  LRU: LRU as LruLikeConstructor,
} as const;

export default defaults;

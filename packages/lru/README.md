<div align="center">

[<img src="https://raw.githubusercontent.com/nberlette/decorators/main/packages/lru/lru_icon.png" alt="@decorators/lru" width="300">][JSR]

# [`@decorators/lru`][JSR]

<big><b>Highly configurable. Strong types. Test-friendly. And really
fast.</b></big>

<small><b>Compatible with Deno, Bun, Node, Cloudflare Workers, and
more.</b></small>

![jsr-score][badge-jsr-score] ![jsr-pkg][badge-jsr-pkg]

<small><small><i>"Not your average memoization decorator."</i></small></small>

</div>

---

This package provides a powerful and highly configurable decorator factory for
memoizing class methods with a memory-safe LRU (least recently used) cache API.
It supports a wide range of [features] and [options] to help you fine-tune the
cache behavior to your specific needs.

```ts
import { lru } from "@decorators/lru";

class BasicExample {
  @lru({ maxSize: 64, ttl: 1000 })
  memoized(arg1: string, arg2: number): string {
    return `${arg1}-${arg2}`;
  }
}

const example = new BasicExample();
console.log(example.memoizedMethod("foo", 42)); // "foo-42"
console.log(example.memoizedMethod("foo", 42)); // "foo-42" (cached)
```

Whether you're new to decorators in TypeScript, or a seasoned veteran in the
game, this package aims to elevate your development experience and **_earn its
place_** in your toolbox.

> **Continue reading to learn about its [usage] and available [features].**
> **_Or jump straight to the [real-world examples] and see it in action!_**

[features]: #features "Jump to the Features section!"
[usage]: #usage "Jump to the Usage section!"
[real-world examples]: #examples "Jump to the Examples section!"
[options]: #options "Jump to the Options section!"

## Install

```sh
deno add jsr:@decorators/lru
```

```sh
bunx jsr add @decorators/lru
```

```sh
pnpm dlx jsr add @decorators/lru
```

```sh
yarn dlx jsr add @decorators/lru
```

```sh
npx -y jsr add @decorators/lru
```

---

## Usage

Here's a rather contrived example demonstrating the most basic usage of the
`@lru` decorator. If you'd like to see more advanced examples, check out the
[examples section](#examples), which covers several real-world use cases.

```ts
import { lru } from "@decorators/lru";

class Calculator {
  @lru({ maxSize: 64, ttl: 1000 })
  fib(n: number): number {
    if (n < 2) return n;
    return this.fib(n - 1) + this.fib(n - 2);
  }
}

const calc = new Calculator();
console.log(`Fibonacci(10): ${calc.fib(10)}`);
```

> At first glance, this may appear to be another run-of-the-mill memoization
> tool. But don't be fooled. The `@decorators/lru` package is far more powerful
> than your typical simple memoization tool.

---

## Features

Aside from supporting all the standard configurations/functionality one would
come to expect in a tool like this, this package cranks up the heat with several
distinct [features] of its own, putting it in a league of its own.

- **TypeScript-First**: Fully typed, well-documented API is a breeze to use.
- **Flexible Caching**: Cache method return values with an LRU strategy (least
  recently used) based on the method's arguments at call time.
- **Cache Capacity**: Limit the cache size to a maximum number of entries,
  automatically evicting the least recently used entries as needed.
  - The default cache capacity is `128` entries.
- **TTL Support**: Automatically expire cache entries after a specified time.
- **Eviction Strategies**: Pick a passive (lazy) or active (scheduled) eviction
  strategy to fine-tune the TTL behavior to your project's specific needs.
  - The default eviction strategy is `"passive"`.
- **Custom Transformers**: Rehydrate or mutate cached values before returning
  them, without sacrificing type safety. Use this to implement more complex
  caching strategies, such as [async caching of HTTP responses].
- **Custom Key Generation**: Custom key generation functions for complex keys
  not easily serializable by the default `JSON.stringify`-based keygen.
- **Memory Safe**: Uses an [advanced storage API][storage] to bind the `LRU`
  lifetimes to those of their associated class instance (and the class itself).
  - This prevents any cache from outliving the class it was created on.
  - _See the [storage API section](#storage-api) for a deep dive into this API._
- **Dependency Injection**: Easily override internal components (e.g., the LRU
  cache class, `Map`, `WeakMap`, `Date`). Designed with test-driven development
  as a core focus.

[storage]: ./#storage-api "View the Storage API section"

> See the [storage API section](#storage-api) for more details on Dependency
> Injection, the [overrides](#overrides) feature, and a cautionary warning.

### Eviction Strategies

#### `"passive"` <sup><i>(the default)</i></sup>

Checks and evicts stale entries on each invocation of the memoized method, as
well as on each cache access ("lazy" eviction). This is the strategy used by
practically every other memoization utility, including Python's
`functools.lru_cache` decorator.

#### `"active"`

Setting the `eviction` option to `"active"` causes the `@lru` decorator to adopt
a more aggressive approach to cache eviction.

Instead of lazily evicting entries that have already expired (potentially
lingering in the cache for an extended period of time beyond their expiration
time), the cache mechanism will now spawn (schedule) a dedicated eviction timer
on all new cache entries.

> [!NOTE]
>
> Using active eviction with very large LRU caches, especially those that see a
> significant level of churn, could potentially result in a performance hit due
> to accumulated overhead of task-scheduling. Exercise caution when using this
> in any performance-sensitive code paths.

If an entry has not been accessed by the time its TTL expires, it will be
immediately evicted from the cache and the timer cleared. If the entry is
accessed before the timer expires, the timer is cleared and set again for the
new TTL, ensuring the cache's recency behavior is retained. This usually results
in improved memory usage, especially when caching large objects.

> [!TIP]
>
> It's strongly encouraged that you adjust the `maxSize` and `ttl` options until
> you find the best balance for your specific use case.

[async caching of HTTP responses]: ./#custom-transform-examples-async-http-caching "View the async caching of HTTP responses example"

---

## API

### Options

| Option      | Type                                                  | Default Value    | Description                                           |
| ----------- | ----------------------------------------------------- | ---------------- | ----------------------------------------------------- |
| `maxSize`   | `number`                                              | `128`            | Maximum number of entries to store in the cache.      |
| `ttl`       | `number`                                              | `0`              | Time-to-live for cache entries, in milliseconds.      |
| `eviction`  | `"passive"` \| `"active"`                             | `"passive"`      | Eviction strategy to use for expired cache entries.   |
| `key`       | [`Keygen`](#keygen)                                   | `JSON.stringify` | Custom key generation function.                       |
| `prepare`   | [`Transform<Return>`](#transform)                     | `(x) => x`       | Custom preparation function for arguments.            |
| `transform` | [`Transform<Return>`](#transform)                     | `(x) => x`       | Custom postprocessing function for cached values.     |
| `inspect`   | `(entry: CacheEntry<K, V>) => void`                   | `undefined`      | Callback for when an entry is inspected in the cache. |
| `onHit`     | `(value: V, key: K, entry: CacheEntry<K, V>) => void` | `undefined`      | Callback for when an entry is hit in the cache.       |
| `onMiss`    | `(key: K) => void`                                    | `undefined`      | Callback for when an entry is missed in the cache.    |
| `onEvict`   | `(value: V, key: K, entry: CacheEntry<K, V>) => void` | `undefined`      | Callback for when an entry is evicted from the cache. |
| `onRefresh` | `(value: V, key: K, entry: CacheEntry<K, V>) => void` | `undefined`      | Callback for when an entry is refreshed in the cache. |
| `overrides` | [`Overrides`](#overrides)                             | `{}`             | Overrides for testing with custom internal APIs.      |

#### `Keygen`

```ts
type Keygen<Params> = (...args: Params) => CacheKey;
```

Describes a key generation function that takes the method arguments and returns
a cache key as a string. The default implementation uses `JSON.stringify`.

#### `Transform`

```ts
typ`e Transform<Input, Output = Input> = (
  value: Input,
  key: CacheKey,
  entry: CacheEntry<Input>,
) => Output;
```

Describes a transformation function that takes the cached value, the cache key,
and the cache entry as its arguments, and returns a transformed value.

> [!NOTE]
>
> The type of the output value currently must be the same as that of the input
> value, due to design decisions made in the Decorators Proposal.
>
> This may change in the future, so this type accepts a second type parameter to
> specify separate input and output types, in case that becomes possible.

#### `Overrides`

Allows you to override the internal APIs used by the `@lru` decorator for more
advanced use cases, such as mocking and testing. This is an advanced feature
that should be used with caution. It ~~can~~ **_will_** lead to unexpected
behavior if it's not used correctly.

| Option    | Type                 | Description                                                |
| --------- | -------------------- | ---------------------------------------------------------- |
| `Map`     | `MapLikeConstructor` | Override the `Map` constructor used for the LRU cache.     |
| `WeakMap` | `MapLikeConstructor` | Override the `WeakMap` constructor used for the LRU cache. |
| `LRU`     | `MapLikeConstructor` | Override the `LRU` constructor used for the LRU cache.     |
| `Date`    | `TimeProvider`       | Override the `Date` constructor used for the TTL timer.    |
| `storage` | `CacheStorage`       | Override the storage API used for the LRU cache.           |

<a id="advanced-warning"></a>

> [!WARNING]
>
> The `overrides` option is considered an expert feature and is not intended to
> be used lightly. **_Do not use this option_** if you do not know **exactly**
> what it does, what it _can_ do, and actually have a good reason to use it.

---

## Examples

Below are some examples of how to use the `@decorators/lru` package in various
real-world scenarios. These examples are designed to be as realistic as
possible, while still being simple enough to understand.

There are also a couple of advanced examples that demonstrate (at length) how
one might leverage the `@decorators/lru` package in a more complex application.

<details><summary><strong><big>①</big> <u>Custom Keygens</u></strong> (basic demonstration)</summary><br>

The default keygen implementation uses `JSON.stringify` to serialize arguments.

```ts
import { lru } from "@decorators/lru";

class Calculator {
  @lru({
    maxSize: 64,
    // serialize the first argument only
    key: (arg) => JSON.stringify(arg),
  })
  square(n: number): number {
    return n * n;
  }
}
```

</details>

<details><summary><strong><big>②</big> <u>Advanced Keygens</u></strong> using <a href="https://en.wikipedia.org/wiki/CBOR">CBOR</a> for complex data</summary><br>

While the default keygen is sufficient for _most_ cases, occasionally it may be
necessary to use a keygen capable of handling complex data types.

For example, caching a method that expects a custom class instance for one or
more of its arguments will more than likely require a custom keygen to handle
properly.

What happens if you don't use a custom keygen? You may end up with poor caching
behavior, as `JSON.stringify` tends to serialize most of the objects it can't
understand into `{}`. No bueno.

```ts
import { lru } from "jsr:@decorators/lru";
// using the `@std/cbor` module (compact binary object representation)
import { encodeCbor } from "jsr:@std/cbor";

// types for our geospatial service
export interface Review {
  user: string;
  rating: number;
  comment: string;
}

export type WeekDay = "Mon" | "Tue" | "Wed" | "Thu" | "Fri" | "Sat" | "Sun";

/** Business hours for a given day. Measured in 24-hour format. */
export interface Hours {
  open: number;
  close: number;
}

export interface Metadata {
  category?: string;
  hours?: Record<WeekDay, Hours | Hours[] | null>;
  reviews?: Review[];
  [key: string]: any;
}

export class Coordinate {
  constructor(
    public name: string,
    public latitude: number,
    public longitude: number,
  ) {}

  get distance(): number {
    return Math.sqrt(
      Math.pow(this.latitude, 2) + Math.pow(this.longitude, 2),
    );
  }

  toString(): string {
    return `${this.name} (${this.latitude}, ${this.longitude})`;
  }
}

export class GeoPoint extends Coordinate {
  constructor(
    public type: "restaurant" | "park" | "store" | "landmark",
    override name: string,
    override latitude: number,
    override longitude: number,
    public metadata?: Metadata,
  ) {
    super(name, latitude, longitude);
  }

  get rating(): number {
    return this.metadata?.reviews?.reduce((sum, r) => sum + r.rating, 0) /
        (this.metadata?.reviews?.length ?? 1) ?? 0;
  }
}

export interface SearchFilters {
  name?: string;
  types?: GeoPoint["type"][];
  price?: [min: number, max: number];
  rating?: number;
  // Could have circular references or complex nested structures
  metadata?: Partial<Metadata>;
}

export class SpatialDatabase {
  constructor(
    protected data: GeoPoint[],
  ) {}

  // naive implementation of a custom keygen that can handle complex objects
  @lru({ key: (...a) => String.fromCharCode(...encodeCbor(a)) })
  // simulating an expensive geospatial querying operation
  query(
    location: Coordinate,
    radius_km: number,
    filters?: SearchFilters,
  ): GeoPoint[] {
    return this.data.filter((point) => {
      if (filters?.types && !filters.types.includes(point.type)) return false;
      if (filters?.name && !point.name.includes(filters.name)) return false;
      if ((filters?.rating ?? 0) > (point.rating ?? 0)) return false;
      if (filters?.price) {
        const [min, max] = filters.price;
        if (point.price < min || point.price > max) return false;
      }
      if (filters?.metadata) {
        for (const [k, v] of Object.entries(filters.metadata)) {
          const pv = point.metadata?.[k];
          if (typeof pv === "undefined") return typeof v === "undefined";
          if (typeof pv !== typeof v) return false;
          if (k === "reviews" && v.length !== pv.length) return false;
          if (typeof v === "object" && v != null) {
            if (JSON.stringify(pv) !== JSON.stringify(v)) return false;
          } else if (pv !== v) return false;
        }
      }
      // check if the point is within the radius of the location
      const a = point.distance, b = location.distance;
      const distance = Math.sqrt(Math.pow(a - b, 2));
      const distance_km = distance * 111.32; // convert to km
      return distance_km <= radius_km;
    });
  }
}

const db = new SpatialDatabase([
  new GeoPoint("restaurant", "Carmine's Pizza Henderson", 36.04142, 115.03036, {
    reviews: [
      { user: "Alice", rating: 5, comment: "Best pizza ever!" },
      { user: "Bob", rating: 4.25, comment: "Killer cannoli!" },
    ],
  }),
  new GeoPoint(
    "restaurant",
    "Raising Cane's Chicken Fingers",
    36.03504,
    115.04634,
    {
      reviews: [
        { user: "Charlie", rating: 4.5, comment: "Great chicken!" },
        { user: "Dave", rating: 4.75, comment: "Love the fries!" },
      ],
    },
  ),
  new GeoPoint("store", "Walmart Supercenter", 36.1699, 115.1398),
  new GeoPoint("landmark", "The Strip", 36.1147, 115.1728),
  new GeoPoint("park", "Red Rock Canyon", 36.1162, 115.4167),
  new GeoPoint("park", "Mount Charleston", 36.2784, 115.6405),
  new GeoPoint("landmark", "Fremont Street Experience", 36.1699, 115.1415),
  new GeoPoint("landmark", "Bellagio Fountains", 36.1126, 115.1767),
  new GeoPoint("landmark", "The Sphere", 36.12086, 115.16174),
]);

console.log(db.query(new Coordinate("home", 36.033, -115.05), 5));
```

</details>

<details><summary><strong><big>③</big> <u>Custom <code>Map</code> Override</u></strong> using a custom <code>Map</code> class</summary><br>

```ts
import { lru } from "@decorators/lru";

class CustomMap<K, V> extends Map<K, V> {
  constructor(entries?: readonly (readonly [K, V])[] | null) {
    super(entries);
    console.log("CustomMap created");
  }

  override get(key: K): V | undefined {
    console.log(`CustomMap.get(${key})`);
    return super.get(key);
  }
}

class Calculator {
  @lru({
    maxSize: 64,
    // override the Map and WeakMap classes which are used internally to store
    // the inner LRU cache without leaking memory
    overrides: {
      Map: CustomMap,
    },
  })
  square(n: number): number {
    return n * n;
  }
}
```

</details>

<details><summary><strong><big>④</big> <u>Custom <code>LRU</code> Override</u></strong> using a custom <code>LRU</code> class</summary><br>

<a id="custom-lru-implementation-example"></a>

The `@decorators/lru` package provides a built-in LRU cache implementation,
which is sufficiently capable for the majority of use cases. However, if you
need to customize the LRU behavior or add additional functionality, you can
either extend the built-in `LRU` class, or create your own from scratch. The
only requirement is that it must implement the `MapLike<K, V>` interface.

Once you've got your custom LRU class ready to go, all that's left to do is pass
it to the `@lru` decorator as the `overrides.LRU` option.

This example demonstrates how to create a custom LRU cache implementation that
logs all operations to the console. This is useful for debugging and
understanding how the LRU cache works under the hood.

```ts
import { crypto } from "jsr:@std/crypto@1/crypto";

import { lru, type MapLike } from "@decorators/lru";

// the default implementation we'll be extending
import { LRU } from "@decorators/lru/cache";

class CustomLRU<K, V> extends LRU<K, V> implements MapLike<K, V> {
  constructor(maxSize?: number) {
    super(maxSize);
    console.log(`CustomLRU created with maxSize: ${maxSize}`);
  }

  override set(key: K, value: V): this {
    console.log(`CustomLRU.set(${key}, ${value})`);
    super.set(key, value);
    return this;
  }

  override has(key: K): boolean {
    console.log(`CustomLRU.has(${key})`);
    return super.has(key);
  }

  override get(key: K): V | undefined {
    console.log(`CustomLRU.get(${key})`);
    return super.get(key);
  }

  override delete(key: K): boolean {
    console.log(`CustomLRU.delete(${key})`);
    return super.delete(key);
  }

  override clear(): void {
    console.log("CustomLRU.clear()");
    super.clear();
  }
}

class Hasher {
  @lru({ maxSize: 32, overrides: { LRU: CustomLRU } })
  hash(arg: string): string {
    console.log(`Expensive operation called with arg: ${arg}`);
    const buf = new TextEncoder().encode(arg);
    const sha = crypto.subtle.digestSync("SHA-256", buf);
    return Array.from(new Uint8Array(sha))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
  }
}

const hasher = new Hasher();

performance.mark("start:uncached");
console.log("[uncached]", hasher.hash("hello"));
performance.mark("end:uncached");

const t1 = performance.measure("end:uncached", "start:uncached");
console.debug("[uncached]", t1.duration, "ms");

performance.mark("start:cached:1");
console.log("[cached #1]", hasher.hash("hello"));
performance.mark("end:cached:1");

const t2 = performance.measure("end:cached:1", "start:cached:1");
console.debug("[cached #1]", t2.duration, "ms");

performance.mark("start:cached:2");
console.log("[cached #2]", hasher.hash("hello"));
performance.mark("end:cached:2");

const t3 = performance.measure("end:cached:2", "start:cached:2");
console.debug("[cached #2]", t3.duration, "ms");
```

</details>

<details><summary><strong><big>⑤</big> <u>Using <code>transform</code> functions</u></strong> for async caching of HTTP responses</summary><br>

<a id="custom-transform-examples-async-http-caching"></a>

```ts
import { lru } from "@decorators/lru";

class RemoteService {
  constructor(
    protected baseUrl: string | URL,
    protected init?: RequestInit,
  ) {}

  @lru({
    transform: async (res) => (await res).clone(),
    ttl: 1e4, /* 10 seconds */
  })
  get(url?: string | URL, init?: RequestInit): Promise<Response> {
    url = new URL(url ?? "", this.baseUrl);
    init = { ...this.init, ...init, method: "GET" };
    return globalThis.fetch(url, init);
  }

  async getJson<T>(
    url?: string | URL,
    init?: RequestInit,
  ): Promise<{ headers: Headers; body: T }> {
    const res = await this.get(url, init);
    return { headers: res.headers, body: await res.json() as T };
  }
}

const api = new RemoteService(
  "https://jsonplaceholder.typicode.com/posts/1",
  { headers: { "Content-Type": "application/json" } },
);

type Post = { userId: number; id: number; title: string; body: string };

const post1 = await api.getJson<Post>(); // ~400ms (first fetch)
const post2 = await api.getJson<Post>(); // ~1ms (cached)

// wait a hair over 10s for the cache to become stale
await new Promise((r) => setTimeout(r, 10_010));

// ... wait >= 10s for the cache to expire ...
const post3 = await api.getJson<Post>(); // ~300ms (expired cache, new fetch)

// check that these are indeed from the same response object
console.assert(post1.headers.get("date") === post2.headers.get("date"));

// check that post3 is a new response from 10s later
console.assert(post1.headers.get("date") !== post3.headers.get("date"));
console.assert(post2.headers.get("date") !== post3.headers.get("date"));

// let's take it a step further and double-check the timestamps, just to be
// certain things are working as expected. post2 and post3 should have at least
// 10_000ms difference between their respective "Date" headers:
console.assert(
  Date.parse(post3.headers.get("date")) -
      Date.parse(post2.headers.get("date")) >= 1e4,
); // OK!
```

</details>

---

## Advanced Features

This section describes some of the more advanced features of the
`@decorators/lru` package, including the `overrides` option. It also describes
the multi-layered storage API used to provide memory safety and prevent leaks.

### Overrides for Test-Driven Development

If you're a developer who takes testing seriously, you might appreciate this
section more than others. The `@decorators/lru` package is developed with
test-driven development as one of its core focal points. It supports
**complete** overrides for every aspect of its caching-related functionality,
including:

- Internal APIs used for `Map`, `WeakMap`, and `LRU` are all overridable.
- Inject a custom `Date` implementation for mocking time-based operations.
- Easily roll your own keygen with custom serialization logic.
- Leverage a custom transform function to rehydrate or mutate returned values.
- Provide a custom `LRU` implementation for full control over the cache.
- Override the `Map` and `WeakMap` classes used to store the LRU instances, for
  introspective testing and debugging (real-world examples including overriding
  the native `WeakMap` with the `IterableWeakMap` from [`@iter/weak-map`], for
  inspecting the weakly-held cache entries).

> **See the [`Overrides` section](#overrides) for more details on this API.**

### Storage API

The `@decorators/lru` package uses a multi-layered `WeakMap` API to bind the
lifetime of every `LRU` instance to that of its associated class, and
additionally ties it to the lifetime of the class constructor itself. This helps
to ensure no cache outlives the class that created it.

The general layout of the storage API is as follows:

1. `WeakMap` - keys are class **constructors**, values are #2.
   - `'c` lifetime is bound to that of the class constructor
   - When available, the `[Symbol.metadata]` object is used as the key.
     - Falls back to the class constructor if metadata is unsupported.
   - When a constructor is garbage collected, sections 2-4 will immediately
     become candidates for collection as well.
2. `WeakMap` - keys are class **instances**, values are #3.
   - `'i` lifetime is bound to that of the class instance.
   - When the class instance is garbage collected, its entire cache is also
     immediately available for collection as well.
3. `Map` - keys are **memoized method names**, values are #4. (lifetime: `'i`)
   - Maintains strong references to the actual `LRU` caches.
   - Lifetime is limited to that of the class instance.
   - Keys are the property names of the memoized methods, providing fast and
     convenient access to the underlying caches.
4. `LRU` - the **actual LRU cache** (lifetime: `'i`).
   - One dedicated instance for each memoized method.
   - Keys are generated by the `options.key` function.

<details><summary><b><u>Click here for a visual representation</u></b></summary><br>

```plaintext
╭╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╮
╵  1. WeakMap<'c Constructor<'i T>, WeakMap<'i T, ... >>       ╵
╵ ╔╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╗ ╵
╵ ╎  2. WeakMap<'i T, ... > - holds class instances          ╎ ╵
╵ ╎ ┏┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┓ ╎ ╵
╵ ╎ ┇  3. Map<PropertyKey, LRU<K, V>> - maps key-to-cache  ┇ ╎ ╵
╵ ╎ ┇ ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓ ┇ ╎ ╵
╵ ╎ ┇ ┃  4. LRU<K, V> - the actual memoization cache     ┃ ┇ ╎ ╵
╵ ╎ ┇ ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛ ┇ ╎ ╵
╵ ╎ ┗┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┛ ╎ ╵
╵ ╚╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╝ ╵
╰╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╯

      ╴╴ weakly-held     ┉┉ strongly-held     ━━ memoized
```

</details>

#### Overriding the Storage API

As mentioned above, the [`overrides`](#overrides) option allows you to override
any of the constructors used for each of the layers in the storage API. This is
useful for testing, debugging, and introspection.

Check out the [examples section](#examples) to see a demonstration of how to
override the `Map` constructor for (layer #3) with a custom implementation that
logs to the console whenever a method is called.

---

<div align="center">

**[MIT]** © **[Nicholas Berlette]**. All rights reserved.

[GitHub] · [Issues] · [JSR] · [Docs]

<!-- -->

[![JSR][badge-jsr]][JSR]

<br>
</div>

[MIT]: https://nick.mit-license.org/2024 "MIT © 2024-2025+ Nicholas Berlette et al. All rights reserved."
[Nicholas Berlette]: https://github.com/nberlette/decorators#readme "View the @decorators monorepo on GitHub"
[GitHub]: https://github.com/nberlette/decorators/tree/main/packages/lru#readme "View the @decorators/lru project on GitHub"
[Issues]: https://github.com/nberlette/decorators/issues?q=is%3Aopen+is%3Aissue+lru "View issues for the @decorators/lru project on GitHub"
[JSR]: https://jsr.io/@decorators/lru/doc "View the @decorators/lru documentation on jsr.io"
[Docs]: https://jsr.io/@decorators/lru/doc "View the @decorators/lru documentation on jsr.io"
[badge-jsr]: https://jsr.io/badges/@decorators "View all of the @decorators packages on jsr.io"
[badge-jsr-pkg]: https://jsr.io/badges/@decorators/lru "View @decorators/lru on jsr.io"
[badge-jsr-score]: https://jsr.io/badges/@decorators/lru/score "View the score for @decorators/lru on jsr.io"
[`@iter/weak-map`]: https://jsr.io/@iter/weak-map "View the @iter/weak-map package on jsr.io"

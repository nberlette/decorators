// deno-lint-ignore-file no-explicit-any
import { describe, it } from "@std/testing/bdd";
import { expect } from "@std/expect";

import lru, { LRU } from "@decorators/lru";

describe("lru (decorator)", () => {
  it("should be a function named 'lru'", () => {
    expect(lru).toBeInstanceOf(Function);
    expect(lru.name).toBe("lru");
  });

  it("should cache the result of a method", () => {
    let computeCount = 0;
    class Test {
      @lru()
      fib(n: number): number {
        computeCount++;
        return n < 2 ? n : this.fib(n - 1) + this.fib(n - 2);
      }
    }
    const t = new Test();
    const res1 = t.fib(5);
    const res2 = t.fib(5);
    expect(res1).toBe(res2);
    // Caching should reduce the number of computations.
    expect(computeCount).toBeLessThan(10);
  });

  it("should support a custom key generator", () => {
    let computeCount = 0;
    const customKey = function (...args: any[]): string {
      return args.join("-");
    };
    class Test {
      @lru({ key: customKey })
      compute(a: number, b: number): number {
        computeCount++;
        return a + b;
      }
    }
    const t = new Test();
    expect(t.compute(1, 2)).toBe(3);
    expect(t.compute(1, 2)).toBe(3);
    expect(computeCount).toBe(1);
  });

  it("should support TTL for passive eviction", async () => {
    let computeCount = 0;
    class Test {
      @lru({ ttl: 100 })
      add(a: number, b: number): number {
        computeCount++;
        return a + b;
      }
    }
    const t = new Test();
    const res1 = t.add(1, 2);
    expect(res1).toBe(3);
    expect(computeCount).toBe(1);

    // Immediate subsequent call should hit cache.
    const res2 = t.add(1, 2);
    expect(res2).toBe(3);
    expect(computeCount).toBe(1);

    // Wait for TTL to expire.
    await new Promise((resolve) => setTimeout(resolve, 150));
    const res3 = t.add(1, 2);
    expect(res3).toBe(3);
    expect(computeCount).toBe(2);
  });

  it("should support active eviction", async () => {
    let computeCount = 0;
    class Test {
      @lru({ ttl: 100, eviction: "active" })
      mult(a: number, b: number): number {
        computeCount++;
        return a * b;
      }
    }
    const t = new Test();
    const res1 = t.mult(2, 3);
    expect(res1).toBe(6);
    expect(computeCount).toBe(1);

    // Wait for TTL to expire and allow active eviction to remove the cache entry.
    await new Promise((resolve) => setTimeout(resolve, 150));
    const res2 = t.mult(2, 3);
    expect(res2).toBe(6);
    expect(computeCount).toBe(2);
  });

  it("should apply transform function", () => {
    let computeCount = 0;
    class Test {
      @lru({ transform: (val) => val * 2 })
      add(a: number, b: number): number {
        computeCount++;
        return a + b;
      }
    }
    const t = new Test();
    const res1 = t.add(1, 2);
    expect(res1).toBe(6); // (1+2)*2 = 6
    const res2 = t.add(1, 2);
    expect(res2).toBe(6);
    expect(computeCount).toBe(1);
  });

  describe("Overrides and Edge Cases", () => {
    it("should use a custom LRU implementation override", () => {
      // Custom LRU that counts its instantiations.
      class CustomLRU<K, V> extends LRU<K, V> {
        static instanceCount = 0;
        constructor(maxSize?: number) {
          super(maxSize);
          CustomLRU.instanceCount++;
        }
      }

      let computeCount = 0;
      class TestCustomLRU {
        @lru({ overrides: { LRU: CustomLRU } })
        compute(n: number): number {
          computeCount++;
          return n * 2;
        }
      }

      const instance = new TestCustomLRU();
      expect(instance.compute(5)).toBe(10);
      expect(instance.compute(5)).toBe(10);
      expect(computeCount).toBe(1);
      expect(CustomLRU.instanceCount).toBe(1);
    });

    it("should use a custom Date override to control TTL behavior", async () => {
      // Fake Date that always returns a fixed time.
      const fixedTime = 1_600_000_000_000;
      class FakeDate extends Date {
        // deno-lint-ignore constructor-super
        constructor(value?: string | number | Date) {
          if (arguments.length === 0) {
            super(fixedTime);
          } else {
            super(value!);
          }
        }
        static override now(): number {
          return fixedTime;
        }
      }

      let computeCount = 0;
      class TestFakeDate {
        @lru({ ttl: 100, eviction: "passive", overrides: { Date: FakeDate } })
        add(a: number, b: number): number {
          computeCount++;
          return a + b;
        }
      }

      const instance = new TestFakeDate();
      expect(instance.add(1, 2)).toBe(3);
      expect(computeCount).toBe(1);

      // Even after waiting, FakeDate.now() remains fixed, so the cached value remains valid.
      await new Promise((resolve) => setTimeout(resolve, 150));
      expect(instance.add(1, 2)).toBe(3);
      expect(computeCount).toBe(1);
    });

    it("should use a custom storage override", () => {
      // Use a custom storage container (a plain Map) instead of the default.
      const customStorage = new Map<object, any>();
      let computeCount = 0;
      class TestCustomStorage {
        @lru({ overrides: { storage: customStorage } })
        multiply(a: number, b: number): number {
          computeCount++;
          return a * b;
        }
      }

      const instance = new TestCustomStorage();
      expect(instance.multiply(2, 3)).toBe(6);
      expect(instance.multiply(2, 3)).toBe(6);
      expect(computeCount).toBe(1);
      expect(customStorage.size).toBeGreaterThan(0);
    });

    it("should use custom Map and WeakMap overrides", () => {
      // Dummy Map and WeakMap that count instantiations.
      class DummyMap<K, V> extends Map<K, V> {
        static instanceCount = 0;
        constructor(entries?: Iterable<readonly [K, V]> | null) {
          super(entries);
          DummyMap.instanceCount++;
        }
      }
      class DummyWeakMap<K extends object, V> extends WeakMap<K, V> {
        static instanceCount = 0;
        constructor(entries?: readonly (readonly [K, V])[]) {
          super(entries);
          DummyWeakMap.instanceCount++;
        }
      }

      let computeCount = 0;
      class TestDummyOverrides {
        @lru({ overrides: { Map: DummyMap, WeakMap: DummyWeakMap } })
        subtract(a: number, b: number): number {
          computeCount++;
          return a - b;
        }
      }

      const instance = new TestDummyOverrides();
      expect(instance.subtract(5, 3)).toBe(2);
      expect(instance.subtract(5, 3)).toBe(2);
      expect(computeCount).toBe(1);
      expect(DummyMap.instanceCount).toBeGreaterThan(0);
      expect(DummyWeakMap.instanceCount).toBeGreaterThan(0);
    });

    it("should correctly apply the transform function", () => {
      let computeCount = 0;
      class TestTransform {
        @lru({ transform: (val) => val * 2 })
        add(a: number, b: number): number {
          computeCount++;
          return a + b;
        }
      }
      const instance = new TestTransform();
      expect(instance.add(3, 4)).toBe(14);
      expect(instance.add(3, 4)).toBe(14);
      expect(computeCount).toBe(1);
    });
  });
});

import { describe, it } from "@std/testing/bdd";
import { expect } from "@std/expect";

import { LRU } from "@decorators/lru";

describe("LRU (class)", () => {
  it("should be a class named 'LRU'", () => {
    expect(LRU).toBeInstanceOf(Function);
    expect(LRU.name).toBe("LRU");
  });

  it("should store the values", () => {
    const cache = new LRU<string, number>(3);
    cache.set("a", 1).set("b", 2).set("c", 3);
    expect(cache.get("a")).toBe(1);
    expect(cache.get("b")).toBe(2);
    expect(cache.get("c")).toBe(3);
  });

  it("should accurately reflect changes in the cache size", () => {
    const cache = new LRU<string, number>(3);
    expect(cache.size).toBe(0);
    cache.set("a", 1);
    expect(cache.size).toBe(1);
    cache.set("b", 2);
    expect(cache.size).toBe(2);
    cache.set("c", 3);
    expect(cache.size).toBe(3);
    cache.delete("a");
    expect(cache.size).toBe(2);
  });

  it("should not exceed the maximum size", () => {
    const cache = new LRU<string, number>(3);
    expect(cache.maxSize).toBe(3);
    expect(cache.size).toBe(0);
    cache.set("a", 1);
    expect(cache.size).toBe(1);
    cache.set("b", 2);
    expect(cache.size).toBe(2);
    cache.set("c", 3);
    expect(cache.size).toBe(3);
    cache.set("d", 4);
    expect(cache.size).toBe(3);
    expect(cache.get("a")).toBe(undefined);
  });

  it("should indicate whether or not it contains a key", () => {
    const cache = new LRU<string, number>(3);
    cache.set("a", 1);
    expect(cache.has("a")).toBe(true);
    expect(cache.has("b")).toBe(false);
    cache.delete("a");
    expect(cache.has("a")).toBe(false);
    expect(cache.has("b")).toBe(false);
    cache.set("b", 2);
    expect(cache.has("b")).toBe(true);
    expect(cache.has("a")).toBe(false);
    cache.clear();
    expect(cache.has("a")).toBe(false);
    expect(cache.has("b")).toBe(false);
    expect(cache.size).toBe(0);
    expect(cache.get("a")).toBe(undefined);
    expect(cache.get("b")).toBe(undefined);
  });

  it("should support deleting a key from the cache", () => {
    const cache = new LRU<string, number>(3);
    cache.set("a", 1);
    expect(cache.size).toBe(1);
    expect(cache.get("a")).toBe(1);
    expect(cache.delete("a")).toBe(true);
    expect(cache.size).toBe(0);
    expect(cache.get("a")).toBe(undefined);
  });

  it("should clear the cache", () => {
    const cache = new LRU<string, number>(3);
    cache.set("a", 1).set("b", 2).set("c", 3);
    expect(cache.size).toBe(3);
    expect(cache.clear()).toBe(undefined);
    expect(cache.size).toBe(0);
    expect(cache.get("a")).toBe(undefined);
    expect(cache.get("b")).toBe(undefined);
    expect(cache.get("c")).toBe(undefined);
  });

  it("should evict the least recently used values", () => {
    const cache = new LRU<string, number>(2);
    cache.set("a", 1).set("b", 2).set("c", 3);
    expect(cache.has("a")).toBe(false);
    expect(cache.get("a")).toBe(undefined);
    expect(cache.get("b")).toBe(2);
    expect(cache.get("c")).toBe(3);
  });

  it("should update the order of the keys", () => {
    const cache = new LRU<string, number>(2);
    cache.set("a", 1).set("b", 2);
    // Access "a" so it becomes most-recent.
    cache.get("a");
    cache.set("c", 3);
    expect(cache.get("a")).toBe(1);
    expect(cache.get("b")).toBe(undefined);
    expect(cache.get("c")).toBe(3);
  });

  it("should remove the key", () => {
    const cache = new LRU<string, number>();
    cache.set("a", 1);
    // Our API uses delete, not remove.
    cache.delete("a");
    expect(cache.get("a")).toBe(undefined);
    expect(cache.delete("b")).toBe(false);
  });

  it("should clear the cache", () => {
    const cache = new LRU<string, number>();
    cache.set("a", 1).set("b", 2);
    cache.clear();
    expect(cache.get("a")).toBe(undefined);
    expect(cache.get("b")).toBe(undefined);
  });

  it("should render the cache as a string when inspected", () => {
    const cache = new LRU<string, number>(3);
    cache.set("a", 1).set("b", 2);
    expect(Deno.inspect(cache)).toBe('LRU(2/3) { "a" => 1, "b" => 2 }');
  });
});

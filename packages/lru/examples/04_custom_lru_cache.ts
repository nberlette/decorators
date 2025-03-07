#!/usr/bin/env -S deno run -A --no-check=remote

import { LRU, lru, type MapLike } from "@decorators/lru";
import { crypto } from "jsr:@std/crypto@1/crypto";

const timer = setTimeout(() => {}, 2_000);
Deno.refTimer(timer); // prevent the event loop from finishing

class CustomLRU<K, V> extends LRU<K, V> implements MapLike<K, V> {
  constructor(maxSize?: number) {
    console.log(`[debug] CustomLRU created with maxSize: ${maxSize}`);
    super(maxSize);
  }

  override get(key: K): V | undefined {
    console.log(`[debug] CustomLRU.get(${key})`);
    return super.get(key);
  }

  override delete(key: K): boolean {
    console.log(`[debug] CustomLRU.delete(${key})`);
    return super.delete(key);
  }
}

class Hasher {
  @lru({
    maxSize: 32,
    eviction: "active",
    overrides: { LRU: CustomLRU },
    ttl: 1000,
  })
  hash(arg: string): string {
    const buf = new TextEncoder().encode(arg);
    const sha = crypto.subtle.digestSync("SHA3-256", buf);
    return Array.from(new Uint8Array(sha))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
  }
}

const hasher = new Hasher();

console.time("uncached");
console.timeLog("uncached", hasher.hash("hello"));
console.timeEnd("uncached");

console.time("cached");
console.timeLog("cached", hasher.hash("hello"));
console.timeEnd("cached");

import { lru } from "@decorators/lru";

class CustomMap<K, V> extends Map<K, V> {
  // deno-lint-ignore no-explicit-any
  static readonly instances = new Set<CustomMap<any, any>>();

  constructor(entries?: readonly (readonly [K, V])[] | null) {
    super(entries);
    console.log("CustomMap created");
    CustomMap.instances.add(this);
  }

  override get(key: K): V | undefined {
    console.log(`CustomMap.get(${key})`);
    return super.get(key);
  }
}

class Calculator {
  @lru({
    maxSize: 64,
    // override the internal Map implementation (which is used to associate
    // LRU cache instances with the corresponding class method name)
    overrides: { Map: CustomMap },
  })
  square(n: number): number {
    return n * n;
  }
}

const calc = new Calculator();

console.log(calc.square(2)); // computed and cached
console.log(calc.square(2)); // cached

console.log(calc.square(3)); // computed and cached
console.log(calc.square(3)); // cached

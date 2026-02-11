import { lru } from "@decorators/lru";

export class Calculator {
  @lru({
    maxSize: 64,
    // serialize the first argument only
    key: (arg) => JSON.stringify(arg),
  })
  square(n: number): number {
    return n * n;
  }
}

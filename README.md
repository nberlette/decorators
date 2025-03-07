<div align="center">

# [<img src="https://jsr.io/badges/@decorators" height="40" alt="@decorators" />][jsr]

Monorepo for packages published under the [`@decorators/*`][JSR] scope on [JSR].

</div>

---

## Packages

### [`@decorators/alias`]

Create aliases between class members and simplify stack traces.

- **[➥ API Documentation](https://jsr.io/@decorators/alias)**
- **[➥ View the README](./packages/alias/README.md)**

```ts
import { alias } from "@decorators/alias";

class Foo {
  // alias() can be used to create multiple aliases from one original member
  @alias("qux", "nurp")
  bar(): string {
    return "baz";
  }

  // declare the aliased members to avoid compilation errors
  declare qux: Foo["bar"];
  declare nurp: Foo["bar"];

  // or, use @alias.for on the alias itself and pass it the original member name.
  @alias.for("bar")
  baz(): string {
    return this.bar();
  }
}

const foo = new Foo();

console.assert(foo.bar === "baz"); // OK
console.assert(foo.bar === foo.baz); // OK
console.assert(foo.qux === foo.bar); // OK
console.assert(foo.nurp === foo.bar); // OK
```

---

### [`@decorators/bind`]

Bind methods, getters, and setters to the appropriate context object, with
support for static members and inheritance.

- **[➥ API Documentation](https://jsr.io/@decorators/bind)**
- **[➥ View the README](./packages/bind/README.md)**

```ts
import { bind } from "@decorators/bind";

class Foo {
  @bind
  bar(): Foo {
    return this;
  }

  @bind
  static self(): typeof Foo {
    return this;
  }
}
const { self } = Foo, { bar } = new Foo();

console.log(self === Foo); // true
console.log(bar() instanceof Foo); // true
```

---

### [`@decorators/lru`]

Highly configurable LRU cache decorator for class methods, with support for TTL,
max size, custom key generation, pre- and post-processing, lifecycle event
handlers, and much more.

- **[➥ API Documentation](https://jsr.io/@decorators/lru)**
- **[➥ View the README](./packages/lru/README.md)**

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

---

### Contributing

Contributions are warmly welcomed! Please read the [Contributing Guide] for
details on our code of conduct, and the process for submitting pull requests.

If you find a bug, please [open an issue] and we will get to it as soon as
possible. Alternatively, if you feel up to fixing it yourself, please create the
issue anyways (so we can track it) and submit a pull request with the fix!

---

### Further Reading

- **[TC39 Decorators Proposal]** - The official TC39 proposal for decorators.
- **[Stage 3 Decorators in Deno]** - A microsite we created that's dedicated to
  cover the [TC39 decorators proposal] and its landmark implementation in Deno.

---

<div align="center">

##### [MIT] © [Nicholas Berlette]. All rights reserved.

###### [GitHub] · [Issues] · [JSR]

</div>

[`@decorators/alias`]: https://jsr.io/@decorators/alias "Check out the '@decorators/alias' package"
[`@decorators/bind`]: https://jsr.io/@decorators/bind "Check out the '@decorators/bind' package"
[`@decorators/lru`]: https://jsr.io/@decorators/lru "Check out the '@decorators/lru' package"
[GitHub]: https://github.com/nberlette/decorators#readme "Check out all the '@decorators/*' packages over at the GitHub monorepo!"
[MIT]: https://nick.mit-license.org "MIT © 2024+ Nicholas Berlette. All rights reserved."
[Nicholas Berlette]: https://github.com/nberlette "Nicholas Berlette on GitHub"
[Issues]: https://github.com/nberlette/decorators/issues "GitHub Issue Tracker for '@decorators/*' packages"
[Open an Issue]: https://github.com/nberlette/decorators/issues/new?assignees=nberlette&labels=bugs&title=%5Bbind%5D+ "Found a bug? Let's squash it!"
[JSR]: https://jsr.io/@decorators "View @decorators/* packages on JSR"
[TC39 Decorators Proposal]: https://github.com/tc39/proposal-decorators "TC39 Proposal: Decorators"
[Stage 3 Decorators in Deno]: https://decorators.deno.dev "Stage 3 Decorators in Deno"
[Contributing Guide]: ./.github/CONTRIBUTING.md "Contributing Guide"

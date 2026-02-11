<div align="center">

# [<img src="https://jsr.io/badges/@decorators" height="40" alt="@decorators" />][jsr]

Monorepo for packages published under the [`@decorators/*`][JSR] scope on [JSR].

</div>

---

## Packages

### [`@decorators/alias`]

Creates aliases for existing class members, with support for methods, getters,
setters, auto-accessors, and fields. Static members are also supported, along
with `#private` members (in environments with support for ES2022 class fields).

- **[➥ API Documentation](https://jsr.io/@decorators/alias)**
- **[➥ View the README](./packages/alias/README.md)**

> [!IMPORTANT]
>
> When working with private members, the `@alias` decorator **must** beß applied
> inside of the **same** enclosing class that the member is declared in. This is
> due to the way that private members are scoped in JavaScript.

Simplifies stack traces for improved debugging, improves code readability for a
more maintainable codebase, and reduces the boilerplate typically associated
with aliasing class members in TypeScript/JavaScript.

#### Install

<img align="right" src="https://api.iconify.design/logos:deno.svg?height=3rem&width=4rem" alt="Deno" />

```sh
deno add @decorators/alias
```

<img align="right" src="https://api.iconify.design/logos:npm.svg?height=3.666rem&width=4rem" alt="NPM">

```sh
npx jsr add @decorators/alias
```

#### Usage

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

#### Install

<img align="right" src="https://api.iconify.design/logos:deno.svg?height=3rem&width=4rem" alt="Deno" />

```sh
deno add @decorators/bind
```

<img align="right" src="https://api.iconify.design/logos:npm.svg?height=3.666rem&width=4rem" alt="NPM">

```sh
npx jsr add @decorators/bind
```

#### Usage

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

#### Install

<img align="right" src="https://api.iconify.design/logos:deno.svg?height=3rem&width=4rem" alt="Deno" />

```sh
deno add @decorators/lru
```

<img align="right" src="https://api.iconify.design/logos:npm.svg?height=3.666rem&width=4rem" alt="NPM">

```sh
npx jsr add @decorators/lru
```

#### Usage

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

### [`@decorators/types`]

Collection of type guard functions, decorator function signatures, decorator
factory signatures, and other utility types for working with both Stage 3 and
Legacy Decorators (Stage 2 / `experimentalDecorators`).

- **[➥ API Documentation](https://jsr.io/@decorators/types)**
- **[➥ View the README](./packages/types/README.md)**

#### Install

<img align="right" src="https://api.iconify.design/logos:deno.svg?height=3rem&width=4rem" alt="Deno" />

```sh
deno add @decorators/types
```

<img align="right" src="https://api.iconify.design/logos:npm.svg?height=3.666rem&width=4rem" alt="NPM">

```sh
npx jsr add @decorators/types
```

#### Usage

```ts
import {
  type AnyDecoratorArguments,
  type AnyDecoratorReturn,
  isDecoratorArguments,
  isLegacyDecoratorArguments,
} from "@decorators/types";

function toStringTag<Args extends AnyDecoratorArguments>(
  value: string,
): (...args: Args) => AnyDecoratorReturn<Args>;
// deno-lint-ignore no-explicit-any
function toStringTag(value: string): (...args: any[]) => any {
  return (...args) => {
    if (isDecoratorArguments(args)) {
      const [target, context] = args;
      if (context.kind !== "class") {
        throw new TypeError(
          `@toStringTag cannot decorate ${context.kind}s - it can only be used on the class itself.`,
        );
      }
      context.addInitializer(function () {
        Object.defineProperty(this.prototype, Symbol.toStringTag, {
          value,
          configurable: true,
        });
      });
    } else if (isLegacyDecoratorArguments(args)) {
      const [target] = args;
      Object.defineProperty(target.prototype, Symbol.toStringTag, {
        value,
        configurable: true,
      });
    } else {
      throw new TypeError("@toStringTag received invalid arguments");
    }
  };
}

// this decorator factory works in TS 4.x and 5.x without issue:
@toStringTag("Foo")
class Foo {
  // ...
}
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

**[MIT] © [Nicholas Berlette]. All rights reserved.**

<small>

[github] · [issues] · [jsr] · [docs] · [contributing]

</small></div>

[`@decorators/alias`]: https://jsr.io/@decorators/alias "Check out the '@decorators/alias' package"
[`@decorators/bind`]: https://jsr.io/@decorators/bind "Check out the '@decorators/bind' package"
[`@decorators/lru`]: https://jsr.io/@decorators/lru "Check out the '@decorators/lru' package"
[`@decorators/types`]: https://jsr.io/@decorators/types "Check out the '@decorators/types' package"
[GitHub]: https://github.com/nberlette/decorators#readme "Check out all the '@decorators/*' packages over at the GitHub monorepo!"
[MIT]: https://nick.mit-license.org "MIT © 2024+ Nicholas Berlette. All rights reserved."
[Nicholas Berlette]: https://github.com/nberlette "Nicholas Berlette on GitHub"
[Issues]: https://github.com/nberlette/decorators/issues "GitHub Issue Tracker for '@decorators/*' packages"
[Open an Issue]: https://github.com/nberlette/decorators/issues/new?assignees=nberlette&labels=bugs&title=%5Bbind%5D+ "Found a bug? Let's squash it!"
[JSR]: https://jsr.io/@decorators "View @decorators/* packages on JSR"
[TC39 Decorators Proposal]: https://github.com/tc39/proposal-decorators "TC39 Proposal: Decorators"
[Stage 3 Decorators in Deno]: https://decorators.deno.dev "Stage 3 Decorators in Deno"
[Contributing Guide]: ./.github/CONTRIBUTING.md "Contributing Guide"
[Contributing]: ./.github/CONTRIBUTING.md "Contributing Guide"
[@decorators/alias]: https://github.com/nberlette/decorators/tree/main/packages/alias#readme "Check out '@decorators/alias' and more over at the GitHub monorepo!"
[@decorators/bind]: https://github.com/nberlette/decorators/tree/main/packages/bind#readme "Check out '@decorators/bind' and more over at the GitHub monorepo!"
[@decorators/types]: https://github.com/nberlette/decorators/tree/main/packages/types#readme "Check out '@decorators/types' and more over at the GitHub monorepo!"
[Docs]: https://nberlette.github.io/decorators "View @decorators API docs"

# [![@][@]decorators][docs]

Monorepo for packages published under the [`@decorators/*`][JSR] scope on [JSR].

---

## Packages

### [`@decorators/alias`]

Creates aliases for existing class members, with support for methods, getters,
setters, auto-accessors, and fields. Static members are also supported, along
with `#private` members (in environments with support for ES2022 class fields).

> **Note**: when working with private members, the `@alias` decorator **must**
> be applied inside of the **same** enclosing class that the member is declared
> in. This is due to the way that private members are scoped in JavaScript; the

Simplifies stack traces for improved debugging, improves code readability for a
more maintainable codebase, and reduces the boilerplate typically associated
with aliasing class members in TypeScript/JavaScript.

#### Install

<img align="right" src="https://api.iconify.design/logos:deno.svg?height=3rem&width=4rem" alt="Deno" />

```sh
deno add @decorators/alias
```

[<img align="right" src="https://jsr.io/logo-square.svg" width="64" height="54" alt="JSR" />][jsr]

```sh
jsr add @decorators/alias
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

#### Install

<img align="right" src="https://api.iconify.design/logos:deno.svg?height=3rem&width=4rem" alt="Deno" />

```sh
deno add @decorators/bind
```

[<img align="right" src="https://jsr.io/logo-square.svg" width="64" height="54" alt="JSR" />][jsr]

```sh
jsr add @decorators/bind
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

### [`@decorators/types`]

Collection of type guard functions, decorator function signatures, decorator
factory signatures, and other utility types for working with both Stage 3 and
Legacy Decorators (Stage 2 / `experimentalDecorators`).

#### Install

<img align="right" src="https://api.iconify.design/logos:deno.svg?height=3rem&width=4rem" alt="Deno" />

```sh
deno add @decorators/types
```

[<img align="right" src="https://jsr.io/logo-square.svg" width="64" height="54" alt="JSR" />][jsr]

```sh
jsr add @decorators/types
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

<div align="center">

##### **[MIT]** © **[Nicholas Berlette]**. <small>All rights reserved.</small>

###### [GitHub] · [Issues] · [Docs]

</div>

[GitHub]: https://github.com/nberlette/decorators#readme "Check out all the '@decorators/*' packages over at the GitHub monorepo!"
[@decorators/alias]: https://github.com/nberlette/decorators/tree/main/packages/alias#readme "Check out '@decorators/alias' and more over at the GitHub monorepo!"
[@decorators/bind]: https://github.com/nberlette/decorators/tree/main/packages/bind#readme "Check out '@decorators/bind' and more over at the GitHub monorepo!"
[@decorators/types]: https://github.com/nberlette/decorators/tree/main/packages/types#readme "Check out '@decorators/types' and more over at the GitHub monorepo!"
[MIT]: https://nick.mit-license.org "MIT © 2024+ Nicholas Berlette. All rights reserved."
[Nicholas Berlette]: https://github.com/nberlette "Nicholas Berlette on GitHub"
[Issues]: https://github.com/nberlette/decorators/issues "GitHub Issue Tracker for '@decorators/*' packages"
[Open an Issue]: https://github.com/nberlette/decorators/issues/new?assignees=nberlette&labels=bugs "Found a bug? Let's squash it!"
[Docs]: https://nberlette.github.io/decorators "View @decorators API docs"
[JSR]: https://jsr.io/@decorators "View @decorators/* packages on JSR"
[@]: https://api.iconify.design/streamline:mail-sign-at-email-at-sign-read-address.svg?width=2.5rem&height=1.4rem&color=%23fb0

# [![@][@]decorators][docs]

Monorepo for packages published under the [`@decorators/*`][JSR] scope on [JSR].

---

## Packages

### [`@decorators/alias`][@decorators/alias]

Alias class members to simplify stack traces.

#### Install

<img align="left" src="https://api.iconify.design/logos:deno.svg?height=3.333rem&width=3rem&inline=true" alt="Deno" />

```sh
deno add @decorators/alias
```

[<img align="right" src="https://jsr.io/logo-square.svg" width="48" height="54" alt="JSR" />][jsr]

```sh
jsr add @decorators/alias
```

<img align="left" src="https://api.iconify.design/logos:npm.svg?height=3.666rem&width=4rem&inline=true" alt="NPM">

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

### [`@decorators/bind`][@decorators/bind]

Bind methods, getters, and setters to the appropriate context object, with
support for static members and inheritance.

#### Install

<img align="left" src="https://api.iconify.design/logos:deno.svg?height=3.333rem&width=3rem&inline=true" alt="Deno" />

```sh
deno add @decorators/bind
```

[<img align="right" src="https://jsr.io/logo-square.svg" width="48" height="54" alt="JSR" />][jsr]

```sh
jsr add @decorators/bind
```

<img align="left" src="https://api.iconify.design/logos:npm.svg?height=3.666rem&width=4rem&inline=true" alt="NPM">

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

### [`@decorators/types`][@decorators/types]

TypeScript type guards, function signatures, and type utilities for Stage 3 and
Legacy (Stage 2 / `experimentalDecorators`) Decorators.

#### Install

<img align="left" src="https://api.iconify.design/logos:deno.svg?height=3.333rem&width=3rem&inline=true" alt="Deno" />

```sh
deno add @decorators/types
```

[<img align="right" src="https://jsr.io/logo-square.svg" width="48" height="54" alt="JSR" />][jsr]

```sh
jsr add @decorators/types
```

<img align="left" src="https://api.iconify.design/logos:npm.svg?height=3.666rem&width=4rem&inline=true" alt="NPM">

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

function tag<Args extends AnyDecoratorArguments>(
  value: string,
): (...args: Args) => AnyDecoratorReturn<Args>;
// deno-lint-ignore no-explicit-any
function tag(value: string): (...args: any[]) => any {
  return (...args) => {
    if (isDecoratorArguments(args)) {
      const [target, context] = args;
      if (context.kind !== "class") {
        throw new TypeError("@tag can only be used on classes");
      }
      context.addInitializer(function () {
        Object.defineProperty(this.prototype, Symbol.toStringTag, {
          value,
          configurable: true,
        });
      });
    } else if (isLegacyDecoratorArguments(args)) {
      return {
        [target.name]: class extends target {
          get [Symbol.toStringTag](): string {
            return value;
          }
        },
      }[target.name];
    } else {
      throw new TypeError("Invalid decorator arguments");
    }
  };
}
```

---

<div align="center">

##### **[MIT]** © **[Nicholas Berlette]**. <small>All rights reserved.</small>

###### [GitHub] · [Issues] · [Docs]

</div>

[@decorators/alias]: https://github.com/nberlette/decorators/tree/main/packages/alias#readme "Check out '@decorators/alias' and more over at the GitHub monorepo!"
[@decorators/bind]: https://github.com/nberlette/decorators/tree/main/packages/bind#readme "Check out '@decorators/bind' and more over at the GitHub monorepo!"
[@decorators/types]: https://github.com/nberlette/decorators/tree/main/packages/tag#readme "Check out '@decorators/types' and more over at the GitHub monorepo!"
[GitHub]: https://github.com/nberlette/decorators/tree/main/packages/bind#readme "Check out all the '@decorators/*' packages over at the GitHub monorepo!"
[MIT]: https://nick.mit-license.org "MIT © 2024+ Nicholas Berlette. All rights reserved."
[Nicholas Berlette]: https://github.com/nberlette "Nicholas Berlette on GitHub"
[Issues]: https://github.com/nberlette/decorators/issues "GitHub Issue Tracker for '@decorators/*' packages"
[Open an Issue]: https://github.com/nberlette/decorators/issues/new?assignees=nberlette&labels=bugs&title=%5Bbind%5D+ "Found a bug? Let's squash it!"
[Docs]: https://n.berlette.com/decorators "View @decorators API docs"
[JSR]: https://jsr.io/@decorators "View @decorators/* packages on JSR"
[Stage 3 Decorators]: https://github.com/tc39/proposal-decorators "TC39 Proposal: Decorators"
[@]: https://api.iconify.design/streamline:mail-sign-at-email-at-sign-read-address.svg?width=2.5rem&height=1.4rem&color=%23fb0

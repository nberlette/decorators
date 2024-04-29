# [![][@]alias][@decorators/alias]

The **`@decorators/alias`** package provides a simple decorator factory named
`@alias`, which allows you to alias one class member to another with **zero
configuration**. It supports aliasing class fields, accessors, methods, getters,
and setters. Compatible with both the instance side _and_ the static side of any
TypeScript/JavaScript class.

## Getting Started

All `@decorators/*` packages are published **exclusively** to **[JSR.io][JSR]**,
a new registry for TypeScript and JavaScript developers, with a keen focus on
performance, security, and compatibility.

### 1. Install

#### [![Deno][badge-deno-2]][Deno]

```sh
deno add @decorators/alias
```

#### [![][badge-jsr]][jsr]

```sh
jsr add @decorators/alias
```

---

<details><summary><strong><u>Additional Package Managers</u></strong></summary>

#### [![Bun][badge-bun]][bun]

```sh
bunx jsr add @decorators/alias
```

#### ![npm][badge-npm-2]

```sh
npx jsr add @decorators/alias
```

#### [![pnpm][badge-pnpm]][pnpm]

```sh
pnpx jsr add @decorators/alias
```

#### [![Yarn][badge-yarn]][yarn]

```sh
yarn dlx jsr add @decorators/alias
```

</details>

---

<details><summary><strong><u>Installation Requirements</u></strong></summary>

<br>

This decorator is developed using the latest iteration of the
[TC39 Decorators Proposal]; these are commonly referred to as **"Stage 3"** or
**_"ES"_ Decorators**, to distinguish them from the legacy TypeScript decorators
that are enabled/disabled via the `experimentalDecorators` compiler flag.

Stage 3 decorators do not require any special configuration to use - they are
enabled by default in TypeScript 5.0+ and Deno 1.40.0+. If you're using an older
version of TypeScript, you should consider upgrading to the latest version to
take advantage of this feature.

[Deno] recently rolled out support for Stage 3 Decorators in the
[`1.40.0` release]. It's the first runtime to support this feature out of the
box, and is my personal choice for TypeScript development. If you're not already
using Deno, I highly recommend giving it a try - it's a fantastic runtime for
beginners and experts alike.

</details>

---

### 2. Enjoy!

```ts
import { alias } from "@decorators/alias";

class Example {
  declare private hello: this["greet"];
  declare private welcome: this["greet"];

  private greeting = "Hello World";

  @alias.for("greeting")
  private message!: string;

  @alias("hello", "welcome")
  greet() {
    return this.message;
  }
}
```

> **Warning**: Please ensure the `experimentalDecorators` option **is disabled**
> in your `tsconfig.json` or `deno.json` file's `compilerOptions` section.
>
> **This package will not work if legacy TypeScript decorators are enabled.**

---

# API

There are two different approaches to creating aliases with this package, both
of which are available from the same named import, `alias`.

## ![][badge-function] `alias`

The first is to use `@alias` directly on a class member you wish to alias, and
provide it with the name(s) of the alias(es) it should create to that member.
This allows you to create any number of aliases for a given class member, with
each alias name passed as an argument to the decorator factory.

#### Usage

```ts
class A {
  // these are important!
  declare b: this["a"];
  declare c: this["a"];

  @alias("b", "c")
  a() {
    // ...
  }
}
```

#### Signature

```ts
export function alias<
  Aliases extends readonly PropertyKey[],
  This extends object = object,
  Value = unknown,
>(...aliases: Aliases): {
  (target: unknown, context: DecoratorContext): void;
};
```

> This signature is in a simplified form for the sake of brevity. See the source
> code in `mod.ts` for the actual function signature as it is used in the
> implementation.

#### Parameters

| Name             | Info                                                      |
| :--------------- | :-------------------------------------------------------- |
| **`...aliases`** | The names of the aliases to create for the target member. |

#### Returns

This decorator factory returns a decorator function that can be applied to any
class member type, including fields, accessors, methods, getters, and setters.
It **_cannot_** be used on the class itself. The decorator it returns does not
return a replacement member, but instead leverages initialization side-effects
via the `addInitializer` API, creating the alias(es) at initialization time.

#### Example

Take note of the logical flow in this approach, demonstrated below, where the
aliases are defined **_on_** the original member that is being decorated. You
can think of it in natural language as
_`"The 'greeting' field is also aliased as 'message'."`_, or
_`"The 'greet' method is also aliased as 'hello' and 'welcome'."`_.

```ts
import { alias } from "@decorators/alias";

class Example {
  declare private message: string;
  declare private hello: this["greet"];
  declare private welcome: this["greet"];

  @alias("message")
  private greeting = "Hello World";

  @alias("hello", "welcome")
  greet() {
    return this.message;
  }
}

const example = new Example();

// The original method:
console.log(example.greet()); // "Hello World"

// The aliases to that method:
console.log(example.hello()); // "Hello World"
console.log(example.welcome()); // "Hello World"
console.log(example.hello === example.greet); // true
```

> **Note**: notice the property declarations in the following example. These
> ensure the TypeScript compiler recognizes each alias as a valid member of the
> class. If they were elided, `tsc` would raise compile errors complaining about
> non-existent properties.

---

## ![][badge-function] `alias.for`

The second approach to aliasing class members with this package is to use the
`@alias.for` method. Similar to the [`@alias`](#alias-1) function, this is also
a decorator factory, but differs in that applied to the alias itself, providing
it with the name of the member it should point to. This accepts only one
argument, which must be the name of another existing member of the class.

#### Usage

```ts
class Hi {
  message = "Hello World";

  greet() {
    return this.message;
  }

  @alias.for("greet") // source: greet, target: hello
  hello!: this["greet"]; // this is defined at initialization

  @alias.for("greet") // source: greet, target: welcome
  welcome(): string { // this is overridden at initialization
    return this.greet();
  }
}
```

#### Signature

```ts
alias.for = function<Source extends PropertyKey>(source: Source): {
  (target: unknown, context: DecoratorContext): void;
};
```

#### Parameters

| Name         | Info                                                            |
| :----------- | :-------------------------------------------------------------- |
| **`source`** | The name of the class member to alias with the decorated alias. |

#### Returns

This decorator factory returns a decorator that can be applied to any class
member type, including fields, accessors, methods, getters, and setters. It
**_cannot_** be used on the class itself. The decorator it returns does not
return a replacement member (except when used on a field/accessor), but instead
leverages initialization side-effects via the `addInitializer` API, creating the
alias(es) at initialization time.

#### Example

```ts
import { alias } from "@decorators/alias";

class Example {
  private greeting = "Hello World";

  @alias.for("greeting")
  private message!: string;

  greet() {
    return this.message;
  }

  @alias.for("greet")
  hello!: this["greet"];

  @alias.for("greet")
  welcome(): string {
    return this.greet();
  }
}

const example = new Example();

// The original method:
console.log(example.greet()); // "Hello World"

// The aliases to that method:
console.log(example.hello()); // "Hello World"
console.log(example.welcome()); // "Hello World"
console.log(example.hello === example.greet); // true
```

---

<details><summary><strong><u>Legacy Decorators Compatibility</u></strong></summary>

This decorator is designed to be used with the latest iteration of the
[TC39 Decorators Proposal]. There are, however, future plans to add a
compatibility layer for the Legacy Decorators format. This will improve
compatibility for many users whose projects still rely on the
`experimentalDecorators` compiler flag, such as those using NestJS for its
Parameter Decorators (which are not included in the Stage 3 proposal).

</details>

---

<div align="center">

##### **[MIT]** © **[Nicholas Berlette]**. <small>All rights reserved.</small>

###### [GitHub] · [Issues] · [Docs]

[![][badge-jsr-score]][jsr]

</div>

[@decorators/alias]: https://github.com/nberlette/decorators/tree/main/packages/alias#readme "Check out 'alias' and more '@decorators/' packages over at the GitHub Monorepo!"
[GitHub]: https://github.com/nberlette/decorators/tree/main/packages/alias#readme "Check out 'alias' and more '@decorators/' packages over at the GitHub Monorepo!"
[MIT]: https://nick.mit-license.org "MIT © 2024+ Nicholas Berlette. All rights reserved."
[Nicholas Berlette]: https://github.com/nberlette "Nicholas Berlette on GitHub"
[Issues]: https://github.com/nberlette/decorators/issues/new?assignees=nberlette&labels=alias,bugs&title=%5Balias%5D+ "Found a bug? Let's squash it!"
[deno]: https://deno.land "Deno's Website"
[jsr]: https://jsr.io/@decorators/alias "View the @decorators/alias package on jsr.io/@decorator/alias"
[docs]: https://jsr.io/@decorators/alias "View @decorators API docs"
[`1.40.0` release]: https://deno.land/blog/1.40 "Deno 1.40.0 Release Notes"
[TC39 Decorators Proposal]: https://github.com/tc39/proposal-decorators "TC39 Proposal: Decorators"
[bun]: https://bun.sh "Bun: a new runtime, bundler, package manager for TypeScript / TSX"
[pnpm]: https://pnpm.io "PNPM Package Manager"
[yarn]: https://yarnpkg.com "Yarn Package Manager"
[@]: https://api.iconify.design/streamline:mail-sign-at-email-at-sign-read-address.svg?width=2.5rem&height=1.4rem&color=%23fa0
[badge-jsr]: https://jsr.io/badges/@decorators/alias "jsr.io/@decorators/alias"
[badge-jsr-score]: https://jsr.io/badges/@decorators/alias/score "jsr.io/@decorators/alias"
[badge-pnpm]: https://api.iconify.design/logos:pnpm.svg?height=1.3rem&inline=true "PNPM"
[badge-bun]: https://api.iconify.design/logos:bun.svg?height=1.5rem&inline=true "Bun"
[badge-yarn]: https://api.iconify.design/logos:yarn.svg?height=1.5rem&inline=true "Yarn"
[badge-npm-2]: https://api.iconify.design/logos:npm.svg?height=1rem&inline=true "NPM"
[badge-deno-2]: https://api.iconify.design/logos:deno.svg?height=2rem&width=2.5rem&inline=true
[badge-function]: https://api.iconify.design/tabler:square-rounded-letter-f-filled.svg?height=1.3rem&color=%232986ff

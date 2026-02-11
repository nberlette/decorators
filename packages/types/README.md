# [![][@]decorators/types][@decorators/types]

The **`@decorators/types`** package provides a comprehensive set of TypeScript
types, type guards, and other utilities for working with TS/JS Decorators.

## Features

- **Stage 3 (ES) Decorators**:
  - `ClassDecoratorFunction`[^1]
  - `ClassFieldDecoratorFunction`[^2]
  - `ClassMethodDecoratorFunction`[^3]
  - `ClassAccessorDecoratorFunction`[^4]
  - `ClassGetterDecoratorFunction`[^5]
  - `ClassSetterDecoratorFunction`[^6]
- **Legacy Decorators** (`experimentalDecorators`[^8])
  - `LegacyClassDecoratorFunction`
  - `LegacyPropertyDecoratorFunction`
  - `LegacyMethodDecoratorFunction`
  - `LegacyAccessorDecoratorFunction`
- **Type Guards** (Predicates):
  - `isDecoratorArguments`
  - `isDecoratorContext`
  - `isLegacyDecoratorArguments`
  - `isIsomorphicDecoratorArguments`
- **Type Utilities**:
  - `DecoratorName`
  - `DecoratorThis`
  - `DecoratorValue`
  - `DecoratorReturn`
  - `DecoratorArguments`
  - Isomorphic[^7] variants: `AnyDecorator[This|Value|Name|Arguments|Return]`
  - Legacy[^8] variants: `LegacyDecorator[This|Value|Name|Arguments|Return]`

Includes types for both Legacy Decorators (Stage 2, `experimentalDecorators`),
and Stage 3 Decorators (ES Decorators), including fully-typed signatures for
each of the different kinds of decorators, their respective arguments, and the
return types of the actual decorator functions themselves.

This allows you to write isomorphic[^7] decorators that work in both Legacy[^8]
(Stage 2) and modern Stage 3 environments, without needing to maintain two
separate implementations.

> **Note**: currently, parameter decorators are only r

[^1]: `ClassDecoratorFunction` is the signature for decorators corresponding to
    the context type `ClassDecoratorContext` (included in TypeScript v5.x+).

[^2]: `ClassFieldDecoratorFunction` is the signature for decorators
    corresponding to the context type `ClassFieldDecoratorContext` (included in
    TypeScript v5.x+).

[^3]: `ClassMethodDecoratorFunction` is the signature for decorators
    corresponding to the context type `ClassMethodDecoratorContext` (included in
    TypeScript v5.x+).

[^4]: `ClassAccessorDecoratorFunction` is the signature for decorators
    corresponding to the context type `ClassAccessorDecoratorContext` (included
    in TypeScript v5.x+).

[^5]: `ClassGetterDecoratorFunction` is the signature for decorators
    corresponding to the context type `ClassGetterDecoratorContext` (included in
    TypeScript v5.x+).

[^6]: `ClassSetterDecoratorFunction` is the signature for decorators
    corresponding to the context type `ClassSetterDecoratorContext` (included in
    TypeScript v5.x+).

[^7]: "Isomorphic Decorators" (a term used throughout this project) describes a
    special type of decorator, that is compatible with the current iteration of
    the Decorators Proposal (Stage 3), as well as the legacy[^8] (Stage 2,
    "experimentalDecorators") implementation in TypeScript. This allows you to
    write decorators that work in both environments, without needing to maintain
    two separate implementations.

[^8]: "Legacy Decorators" refer to TypeScript's implementation of a previous
    iteration of the TC39 Decorators Proposal, which never surpassed Stage 2
    (also commonly known as Stage 2 or "experimental decorators"). These require
    the "experimentalDecorators"[^9] option to be enabled in your TypeScript
    compiler options configuration.

[^9]: Before TypeScript v4.x, these required you to enable the
    "experimentalDecorators" compiler option. In TypeScript v4.x they are
    enabled default. Starting in TypeScript v5.0, the newer Stage 3 decorators
    are the default, and these legacy (Stage 2) decorators once again require
    the "experimentalDecorators" option to be enabled.

## Getting Started

All `@decorators/*` packages are published **exclusively** to **[JSR.io][JSR]**,
a new registry for TypeScript and JavaScript developers, with a keen focus on
performance, security, and compatibility.

### Install

[<img align="left" src="https://api.iconify.design/logos:deno.svg?height=3.333rem&width=3rem&inline=true" alt="Deno" />][deno]

```sh
deno add @decorators/types
```

[<img align="right" src="https://jsr.io/logo-square.svg" width="48" height="54" alt="JSR" />][jsr]

```sh
jsr add @decorators/types
```

<img align="left" src="https://api.iconify.design/logos:npm.svg?height=3.666rem&width=4rem&inline=true" alt="NPM" />

```sh
npx jsr add @decorators/types
```

[<img align="right" src="https://api.iconify.design/logos:bun.svg?height=3.333rem&width=3rem&inline=true" alt="Bun" />][bun]

```sh
bunx jsr add @decorators/types
```

[<img align="left" src="https://api.iconify.design/logos:pnpm.svg?height=3.333rem&width=3rem&inline=true" alt="PNPM" />][pnpm]

```sh
pnpx jsr add @decorators/types
```

[<img align="right" src="https://api.iconify.design/logos:yarn.svg?height=3.333rem&width=3rem&inline=true" alt="Yarn" />][yarn]

```sh
yarn dlx jsr add @decorators/types
```

---

### Features

Stage 3 Decorators are located in the root of the package:

| Feature                          | Path          |
| :------------------------------- | :------------ |
| `ClassDecoratorFunction`         | `./class`     |
| `ClassFieldDecoratorFunction`    | `./field`     |
| `ClassMethodDecoratorFunction`   | `./method`    |
| `ClassAccessorDecoratorFunction` | `./accessor`  |
| `ClassGetterDecoratorFunction`   | `./getter`    |
| `ClassSetterDecoratorFunction`   | `./setter`    |
| **Predicate Functions**          | `./guards`    |
| **Type Utilities**               | `./utilities` |

Legacy Decorators are located in the `legacy` directory:

| Feature                           | Import Path          |
| :-------------------------------- | :------------------- |
| `LegacyClassDecoratorFunction`    | `./legacy/class`     |
| `LegacyPropertyDecoratorFunction` | `./legacy/field`     |
| `LegacyMethodDecoratorFunction`   | `./legacy/method`    |
| `LegacyAccessorDecoratorFunction` | `./legacy/accessor`  |
| **Predicate Functions**           | `./legacy/guards`    |
| **Type Utilities**                | `./legacy/utilities` |

Isomorphic types (supporting both Legacy and Stage 3 decorators) are located in
the root of the package (alongside the Stage 3 types). They are easily
distinguished from the other types by their `Any` prefix.

For the best results, it's recommended that you pick one of the following 3
conventions for your decorator implementations, and utilize the types that are
within that same column.

Meaning, if you're creating a legacy decorator package, stick to using the types
in the `Legacy` category. If you're creating a Stage 3 decorator package without
Legacy support, use the types in the `Stage 3` column. If you're experimenting
with both and wish to support either environment, or if you're unsure of your
user's environment, use the `Isomorphic` types.

|       Stage 3        |           Legacy           |       Isomorphic        |
| :------------------: | :------------------------: | :---------------------: |
| `DecoratorArguments` | `LegacyDecoratorArguments` | `AnyDecoratorArguments` |
|  `DecoratorReturn`   |  `LegacyDecoratorReturn`   |  `AnyDecoratorReturn`   |
|   `DecoratorThis`    |   `LegacyDecoratorThis`    |   `AnyDecoratorThis`    |
|   `DecoratorValue`   |   `LegacyDecoratorValue`   |   `AnyDecoratorValue`   |
|   `DecoratorName`    |   `LegacyDecoratorName`    |   `AnyDecoratorName`    |

### Examples

Here's a quick example of how you can use the `@decorators/types` package to
create an isomorphic memoization decorator that can be used in both legacy and
Stage 3 environments, without sacrificing type safety or code quality.

```ts
import type {
  AnyDecoratorArguments, // union of all possible decorator argument types
  AnyDecoratorReturn, // determines correct return type from decorator args
  AnyDecoratorThis, // determines contextual `this` type from decorator args
  AnyDecoratorValue, // determines decorator value type from decorator args
} from "@decorators/types";

/**
 * Isomorphic memoization decorator that can be used on any class member or on
 * a class constructor itself.
 */
function memoize<
  const Args extends AnyDecoratorArguments,
> // If you need to access the `this` type, you can use this type:
// This extends AnyDecoratorThis<Args>,
// If you need to access the value type, you can use this type:
// Value extends AnyDecoratorValue<Args>,
(
  options?: MemoizeOptions,
): (...args: [...Args]) => AnyDecoratorReturn<Args> {
  return (target, context) => {
    switch (context.kind) {
      case "class": // ... handle class decorators ...
        break;
      case "field": // ... handle field decorators ...
        break;
        // ... implement additional target types here ...
    }
  };
}
```

---

## API

### ![][badge-function] `isDecoratorArguments`

Checks if a given tuple is a valid set of Stage 3 Decorator arguments. This is a
rigorous type guard that ensures the tuple is a valid set of arguments for a
decorator function, cross-checking the expected `target` type against the kind
of decorator as determined by the `context.kind` value.

```ts
import {
  type AnyDecoratorArguments,
  type AnyDecoratorReturn,
  isDecoratorArguments,
} from "@decorators/types";

const isomorphic = <This, Value, Args extends AnyDecoratorArguments>(
  ...args: Args
): AnyDecoratorReturn<Args> => {
  if (isDecoratorArguments(args)) {
    // stage 3 decorator arguments detected (i.e. [target, context]).
  } else {
    // either legacy decorators, or invalid arguments.
    // perform additional checks here for legacy implementation.
  }
};

// This decorator will now work in both legacy and stage 3 environments:
@isomorphic
class MyClass {}
```

---

### ![][badge-function] `isLegacyDecoratorArguments`

Checks if a given tuple is a valid set of legacy TypeScript Decorator arguments.
This is a rigorous type guard that ensures the tuple is a valid set of arguments
for a legacy (stage 2, experimental) TypeScript decorator function, and not
those of a Stage 3 Decorator or a different type of function.

```ts
import {
  type AnyDecoratorArguments,
  isLegacyDecoratorArguments,
} from "@decorators/types";

const isomorphic = (...args: LegacyDecoratorArguments) => {
  if (isLegacyDecoratorArguments(args)) {
    // legacy TypeScript decorator arguments detected (i.e. [target, key, desc]).
  } else {
    // either stage 3 decorators, or invalid arguments.
    // perform additional checks here for stage 3 implementation.
  }
};

// This decorator will now work in both legacy and stage 3 environments:
@isomorphic
class MyClass {}
```

---

### ![][badge-function] `isAnyDecoratorArguments`

Checks if a given tuple is a valid set of Stage 3 Decorator arguments _or_ a
valid set of legacy TypeScript Decorator arguments. This is a simple logical OR
operation that relies on the `isDecoratorArguments` and
`isLegacyDecoratorArguments` functions to determine the type of decorator
arguments provided. It is highly recommended that you use one or both of those
functions in addition to this one, to narrow down the input type as accurately
as possible.

```ts
import {
  type AnyDecoratorArguments,
  isAnyDecoratorArguments,
} from "@decorators/types";

const isomorphic = (...args: ) => {
  if (isAnyDecoratorArguments(args)) {
    // stage 3 or legacy TypeScript decorator arguments detected.
    // proceed with further checks to determine the exact type.
  } else {
    throw new TypeError("Invalid decorator arguments provided.");
  }
};
```

---

### ![][badge-function] `isDecoratorContext`

Checks if a given value is a valid Stage 3 Decorator context object. This will
return `true` only if the object has a `kind` property that matches one of the
valid decorator kinds, an `addInitializer` method, a `name` property (that is
either a `string` or `undefined` if `kind` is `"class"`, or a `string` or
`symbol` otherwise).

If the `kind` property is _not_ `"class"`, the object must also have a `private`
property that is a boolean, a `static` property that is also a boolean, and an
`access` property that is an object with `has`, `get`, or `set` properties
(depending on the value of `kind`).

```ts
import { isDecoratorContext } from "@decorators/types";

const isomorphic = (target: unknown, context: unknown) => {
  if (isDecoratorContext(context)) {
    // stage 3 decorator context detected.
  } else {
    // perform additional checks here for legacy implementation.
  }
};
```

---

### ![][badge-type] `DecoratorArguments<This, Value>`

Represents the arguments for all **Stage 3 Decorator** kinds, as a union of
tuple pairs. This is a **generic type**[^10] with two (optional) parameters:

1. `This` - the type of the contextual `this` binding for . For class decorators
   and those applied to static members, this will be the type of the class
   itself (e.g. `typeof ClassName`). In decorators applied to instance members,
   this will be the type of the class instance (e.g. `ClassName`).
2. `Value` - the type of the value being decorated. This is the type of the
   propeerty, method, or accessor being decorated, and is

This type can be used in conjunction with the `isDecoratorArguments` function
and `DecoratorReturn` type to create an overloaded decorator or decorator
factory function, by inferring the type of decorator being used based on the
specific arguments the function is called with at runtime. We leverage the
compile-time information about those same arguments to determine the correct
return type, ensuring type safety is maintained throughout the entire process.

```ts
import type { DecoratorArguments, DecoratorReturn } from "@decorators/types";
```

```ts
import type {
  AnyDecoratorArguments,
  AnyDecoratorReturn,
} from "@decorators/types";

// isomorphic decorator
function memoize<Args extends AnyDecoratorArguments>(
  ...args: Args
): AnyDecoratorReturn<A> {
  // ... implementation here ...
}

// If you need to pass outer arguments to the decorator, you can use
// isomorphic decorator factory
function memoizeFactory<Args extends AnyDecoratorArguments>(
  options?: MemoizeOptions,
): (...args: Args) => AnyDecoratorReturn<Args> {
  // ... implementation here ...
}

@memoize @memoizeFactory()
class Foo {
  @memoize
  bar = 42;

  @memoizeFactory({ maxAge: 1000 })
  baz() {
    return "qux";
  }

  @memoize
  @memoizeFactory({})
  get quux() {
    return Math.random() * 1e6 | 0;
  }
}
```

---

<div align="center">

##### **[MIT]** © **[Nicholas Berlette]**. <small>All rights reserved.</small>

###### [Read the Docs][Docs] · [View Source][GitHub] · [Squash a Bug][Issues]

<br>

[![][badge-jsr-decorators] ![][badge-jsr] ![][badge-jsr-score]][jsr]

</div>

[@decorators/types]: https://github.com/nberlette/decorators/tree/main/packages/types#readme "Check out '@decorators/types' and more decorator packages in our GitHub monorepo!"
[GitHub]: https://github.com/nberlette/decorators/tree/main/packages/types#readme "Check out '@decorators/types' and more decorator packages in our GitHub monorepo!"
[MIT]: https://nick.mit-license.org "MIT © 2024+ Nicholas Berlette. All rights reserved."
[Nicholas Berlette]: https://github.com/nberlette "Nicholas Berlette's GitHub Profile"
[Issues]: https://github.com/nberlette/decorators/issues/new?assignees=nberlette&labels=types,bugs&title=%5Btypes%5D+ "Found a bug? Let's squash it!"
[deno]: https://deno.land "Deno's Official Website"
[jsr]: https://jsr.io/@decorators/types "View the @decorators/types package on jsr.io/@decorator/types"
[docs]: https://jsr.io/@decorators/types "View @decorators API docs"
[`1.40.0` release]: https://deno.land/blog/1.40 "Deno 1.40.0 Release Notes"
[TC39 Decorators Proposal]: https://github.com/tc39/proposal-decorators "TC39 Proposal: Decorators"
[bun]: https://bun.sh "Bun: a new runtime, bundler, package manager for TypeScript / TSX"
[pnpm]: https://pnpm.io "PNPM Package Manager"
[yarn]: https://yarnpkg.com "Yarn Package Manager"
[@]: https://api.iconify.design/streamline:mail-sign-at-email-at-sign-read-address.svg?width=2.5rem&height=1.4rem&color=%23fa0
[badge-jsr-decorators]: https://jsr.io/badges/@decorators "jsr.io/@decorators"
[badge-jsr]: https://jsr.io/badges/@decorators/types "jsr.io/@decorators/types"
[badge-jsr-score]: https://jsr.io/badges/@decorators/types/score "jsr.io/@decorators/types"
[badge-pnpm]: https://api.iconify.design/logos:pnpm.svg?height=1.3rem&inline=true "PNPM"
[badge-bun]: https://api.iconify.design/logos:bun.svg?height=1.5rem&inline=true "Bun"
[badge-yarn]: https://api.iconify.design/logos:yarn.svg?height=1.5rem&inline=true "Yarn"
[badge-npm-2]: https://api.iconify.design/logos:npm.svg?height=1rem&inline=true "NPM"
[badge-deno-2]: https://api.iconify.design/logos:deno.svg?height=2rem&width=2.5rem&inline=true
[badge-function]: https://api.iconify.design/tabler:square-rounded-letter-f-filled.svg?height=1.3rem&color=%232986ff
[badge-type]: https://api.iconify.design/tabler:square-rounded-letter-t-filled.svg?height=1.3rem&color=orchid

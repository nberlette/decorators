# [![][@]bind][@decorators/bind]

The **`@decorators/bind`** package provides a super-easy-to-use decorator,
designed to fuse class members to the appropriate context objects with **zero
configuration**. It supports binding class methods, getters, and setters, on
either the instance side or static side of a class.

## Getting Started

All `@decorators/*` packages are published **exclusively** to **[JSR.io][JSR]**,
a new registry for TypeScript and JavaScript developers, with a keen focus on
performance, security, and compatibility.

### 1. Install

#### [![Deno][badge-deno-2]][Deno]

```sh
deno add @decorators/bind
```

#### [![][badge-jsr]][jsr]

```sh
jsr add @decorators/bind
```

---

<details><summary><strong><u>Additional Package Managers</u></strong></summary>

#### [![Bun][badge-bun]][bun]

```sh
bunx jsr add @decorators/bind
```

#### ![npm][badge-npm-2]

```sh
npx jsr add @decorators/bind
```

#### [![pnpm][badge-pnpm]][pnpm]

```sh
pnpx jsr add @decorators/bind
```

#### [![Yarn][badge-yarn]][yarn]

```sh
yarn dlx jsr add @decorators/bind
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
import { bind } from "@decorators/bind";

class Example {
  #value = "Hello, world!";

  @bind
  greet(message = "How are you?") {
    return this.#value + " " + message;
  }

  @bind
  setGreeting(value: string) {
    this.#value = value;
  }
}
```

> **Warning**: Please ensure the `experimentalDecorators` option **is disabled**
> in your `tsconfig.json` or `deno.json` file's `compilerOptions` section.
>
> **This package will not work if legacy TypeScript decorators are enabled.**

---

# API

The **`bind`** function has several different overload signatures, each of which
supports a different type of class member.

## ![][badge-function] `bind` [<img align="right" src="https://img.shields.io/badge/for:-methods-rebeccapurple.svg?style=for-the-badge" alt="This decorator overload is for class methods">][methods]

Bind a class **method** to an instance or constructor, depending on whether or
not it is a static method. This overload is the most common application of the
`@bind` decorator, and is intended to be used on regular class methods. For
binding **[getters]** and **[setters]**, see the appropriate overloads below.

#### Usage

```ts
@bind method() {
  return this.#value;
}
```

#### Signature

```ts
export function bind<This, Value extends (this: This, ...args: unknown) => any>(
  method: Value,
  context: ClassMethodDecoratorContext<This, Value>,
): void;
```

#### Parameters

This decorator does not accept any parameters from the user, and is not designed
to be used as a decorator factory. Instead, it should be used as a standalone
decorator applied directly to the target class method using
`@bind method() { ... }`.

| Name          | Info                                                            |
| :------------ | :-------------------------------------------------------------- |
| **`method`**  | The target method to bind to the class instance or constructor. |
| **`context`** | The method-specific decorator context object.                   |

#### Returns

This decorator does not return a value; instead, it leverages a side-effect
style initializer callback via the `addInitializer` API.

---

## ![][badge-function] `bind` [<img align="right" src="https://img.shields.io/badge/for:-getters-blue.svg?style=for-the-badge" alt="This decorator overload is for class getters">][getters]

Bind a class getter (`get name() { ... }`) to an instance or constructor,
depending on whether it is a prototype member or a static member, respectively.

This is useful for hardening getters that rely on a private backing field, which
are notoriously difficult to work with when subclassing and proxying class
instances. Using this decorator ensures you won't encounter errors like this:

```diff
-> Error: Cannot read private member #value from an object whose class did not declare it
```

You can rest easy knowing that a getter decorated with `@bind` is forever bound
to the original instance or constructor. It's a lifelong commitment, no
takebacks.

#### Usage

```ts
@bind get value(): string {
  return this.#value;
}
```

#### Signature

```ts
export function bind<This, Value>(
  getter: (this: This) => Value,
  context: ClassGetterDecoratorContext<This, Value>,
): void;
```

#### Parameters

| Name          | Info                                                                |
| :------------ | :------------------------------------------------------------------ |
| **`getter`**  | The target **getter** to bind to the class instance or constructor. |
| **`context`** | The getter-specific decorator context object.                       |

#### Returns

This decorator doesn't return a replacement getter function, but leverages a
side-effect-like initialization callback via the `addInitializer` API to bind
the target to the appropriate context object at the time of initialization.

---

## ![][badge-function] `bind` [<img align="right" src="https://img.shields.io/badge/for:-setters-indianred.svg?style=for-the-badge" alt="This decorator overload is for class setters">][setters]

Binds a setter method (`set name(value) { ... }`) to the appropriate `this`
context object. Depending on whether it is a prototype member or a static
member, this will either be the class instance or the class constructor,
respectively.

This is useful for hardening setters that rely a private backing field, which
are notoriously difficult to work with when subclassing and proxying class
instances. Using this decorator ensures you won't encounter errors like this:

```diff
-> Error: Cannot write private member #value to an object whose class did not declare it
```

You can rest easy knowing that a setter decorated with `@bind` is forever bound
to the original instance or constructor. It's a lifelong commitment, no
takebacks.

#### Usage

```ts
@bind set value(value: string) {
  this.#value = value;
}
```

#### Signature

```ts
export function bind<This, Value>(
  setter: (this: This, value: Value) => void,
  context: ClassSetterDecoratorContext<This, Value>,
): void;
```

#### Parameters

| Name          | Info                                                            |
| :------------ | :-------------------------------------------------------------- |
| **`setter`**  | The target setter to bind to the class instance or constructor. |
| **`context`** | The setter-specific decorator context object.                   |

#### Returns

This decorator doesn't return a replacement setter function, but leverages a
side-effect-like initialization callback via the `addInitializer` API to bind
the target to the appropriate context object at the time of initialization.

---

### How does it work?

This decorator is what I like to call an **_isomorphic decorator_**. It was
designed to be used on several different types of class members, on either side
of a class, all while maintaining a consistent API and behavior throughout.

<details><summary><strong><u>Under the hood</u></strong></summary>

1. `@bind` uses the `addInitializer` API of the decorator context, to hook into
   the class instance or constructor at initialization time.
   - The decorator itself returns nothing, and is just a hook registrar.
   - This is in contrast to legacy patterns of returning a new descriptor or
     modifying prototypes, as well as returning a replacement function.
2. The actual binding is performed by a standard `Function.prototype.bind` call
   during the initialization phase.
   - The bound function has its `name` and `length` properties updated to match
     those of the original target method/getter/setter function, eliminating
     traces of the binding operation from the public interface.
3. Finally, the original member is overridden using `Reflect.defineProperty`,
   - Allows us to preserve property attributes like its writability,
     enumerability, and configurability.
   - Avoids triggering potential side effects like getters/setters.

</details>

<details><summary><strong><u>How is this any different from other decorators?</u></strong></summary>

This is a somewhat unorthodox approach compared to other decorators that intend
to solve the same problem. Typically, the bound function is simply assigned to
the target object using a simple property assignment operation not unlike this:

```ts
this[context.name] = target.bind(this);
```

This results in a new **class _field_** being created on the instance, which
shadows the original method of the same name. It will also leave traces of the
binding being performed: the method name would be prefixed with `"bound "`, and
it would also be visible to the public, since that is now an enumerable field
rather than a non-enumerable method that it should be.

This decorator avoids these issues by using the `Reflect.defineProperty` API to
override the original method, ensuring that the binding operation is not visible
to the public interface, and that the method remains non-enumerable.

</details>

<details><summary><strong><u>Legacy Decorators Compatibility</u></strong></summary>

This decorator is designed to be used with the latest iteration of the
[TC39 Decorators Proposal]. There are, however, future plans to add a
compatibility layer for the Legacy Decorators format. This will improve
compatibility for many users whose projects still rely on the
`experimentalDecorators` compiler flag, such as those using NestJS for its
Parameter Decorators (which are not included in the Stage 3 proposal).

</details>

---

## Examples

#### Basic Usage (Instance Methods)

```ts
import bind from "@decorators/bind";

class Example {
  #value = "Hello, world!";

  @bind
  greet(message = "How are you?") {
    return this.#value + " " + message;
  }

  @bind
  setGreeting(value: string) {
    this.#value = value;
  }
}

const example = new Example();
const { greet, setGreeting } = example;

console.log(greet()); // => "Hello, world! How are you?"
setGreeting("Goodbye, world!"); // ✔️ no error
console.log(greet("¡Hasta luego!")); // => "Goodbye, world! ¡Hasta luego!"
```

#### Basic Usage (Instance/Static Members)

```ts
import bind from "@decorators/bind";

class Example {
  static #value = "Hello, world!";

  @bind
  static greet(message = "How are you?") {
    return this.#value + " " + message;
  }

  @bind
  static setGreeting(value: string) {
    this.#value = value;
  }
}
```

#### Subclassing

```ts
import bind from "@decorators/bind";

class Example {
  #value = "Hello, world!";

  @bind
  greet(message = "How are you?") {
    return this.#value + " " + message;
  }

  @bind
  setGreeting(value: string) {
    this.#value = value;
  }
}

class Subclass extends Example {
  @bind
  greet(message = "How are you?") {
    return super.greet(message) + " (subclass)";
  }
}

const example = new Example();
const subclass = new Subclass();

console.log(example.greet()); // => "Hello, world! How are you?"
console.log(subclass.greet()); // => "Hello, world! How are you? (subclass)"
```

#### Cloning

```ts
import bind from "@decorators/bind";

class Example {
  #value = "Hello, world!";

  @bind
  get greeting() {
    return this.#value;
  }

  @bind
  setGreeting(value: string) {
    this.#value = value;
    return this;
  }
}

const example = new Example();
console.log(example.greeting); // => "Hello, world!"

const { setGreeting } = example;
setGreeting("Goodbye, world!");

console.log(example.greeting); // => "Goodbye, world!"

const clone = Object.create(null, {
  // normally, this would fail due to the getter having no `this` context.
  greeting: Object.getOwnPropertyDescriptor(example, "greeting"),
});

console.log(clone.greeting); // => "Goodbye, world!"
```

#### Proxying

This example is a scenario I've personally found myself in several times.

When proxying a class instance (returning a new Proxy from the constructor
function that wraps the `this` value), there's quite a few gotcha's and caveats
that many developers are unaware of.

One of these caveats is that, without the use of some sort of binding logic such
as this decorator, that special proxied version of `this` we return **loses
access to all private fields**.

```ts
import bind from "@decorators/bind";

class Example {
  #value = "Hello, world!";

  constructor() {
    return new Proxy(this, {
      get(target, p, receiver) {
        if (!isNaN(+p.toString())) {
          return Reflect.get(target, "greeting", receiver)?.at(+p);
        }
        return Reflect.get(target, p, receiver);
      },
      set(target, p, value, receiver) {
        return Reflect.set(target, p, value, receiver);
      },
    });
  }

  @bind
  greet(message = "How are you?") {
    return this.#value + " " + message;
  }

  @bind
  get greeting() {
    return this.#value;
  }

  @bind
  set greeting(value: string) {
    this.#value = value;
  }
}

const example = new Example();

example.greeting = "Goodbye, world!"; // ✔️ no error
console.log(example.greet()); // ✔️ no error
console.log(example[1]); // => "o"
```

---

<div align="center">

##### **[MIT]** © **[Nicholas Berlette]**. <small>All rights reserved.</small>

###### [GitHub] · [Issues] · [Docs]

[![][badge-jsr-score]][jsr]

</div>

[methods]: #bind "Overload for class methods"
[getters]: #bind-1 "Overload for class getters"
[setters]: #bind-2 "Overload for class setters"
[@decorators/bind]: https://github.com/nberlette/decorators/tree/main/packages/bind#readme "Check out 'bind' and more '@decorators/' packages over at the GitHub Monorepo!"
[GitHub]: https://github.com/nberlette/decorators/tree/main/packages/bind#readme "Check out 'bind' and more '@decorators/' packages over at the GitHub Monorepo!"
[MIT]: https://nick.mit-license.org "MIT © 2024+ Nicholas Berlette. All rights reserved."
[Nicholas Berlette]: https://github.com/nberlette "Nicholas Berlette on GitHub"
[Issues]: https://github.com/nberlette/decorators/issues/new?assignees=nberlette&labels=bind,bugs&title=%5Bbind%5D+ "Found a bug? Let's squash it!"
[deno]: https://deno.land "Deno's Website"
[jsr]: https://jsr.io/@decorators/bind "View the @decorators/bind package on jsr.io/@decorator/bind"
[docs]: https://jsr.io/@decorators/bind "View @decorators API docs"
[`1.40.0` release]: https://deno.land/blog/1.40 "Deno 1.40.0 Release Notes"
[TC39 Decorators Proposal]: https://github.com/tc39/proposal-decorators "TC39 Proposal: Decorators"
[bun]: https://bun.sh "Bun: a new runtime, bundler, package manager for TypeScript / TSX"
[pnpm]: https://pnpm.io "PNPM Package Manager"
[yarn]: https://yarnpkg.com "Yarn Package Manager"
[@]: https://api.iconify.design/streamline:mail-sign-at-email-at-sign-read-address.svg?width=2.5rem&height=1.4rem&color=%23fa0
[badge-jsr]: https://jsr.io/badges/@decorators/bind "jsr.io/@decorators/bind"
[badge-jsr-score]: https://jsr.io/badges/@decorators/bind/score "jsr.io/@decorators/bind"
[badge-pnpm]: https://api.iconify.design/logos:pnpm.svg?height=1.3rem&inline=true "PNPM"
[badge-bun]: https://api.iconify.design/logos:bun.svg?height=1.5rem&inline=true "Bun"
[badge-yarn]: https://api.iconify.design/logos:yarn.svg?height=1.5rem&inline=true "Yarn"
[badge-npm-2]: https://api.iconify.design/logos:npm.svg?height=1rem&inline=true "NPM"
[badge-deno-2]: https://api.iconify.design/logos:deno.svg?height=2rem&width=2.5rem&inline=true
[badge-function]: https://api.iconify.design/tabler:square-rounded-letter-f-filled.svg?height=1.3rem&color=%232986ff

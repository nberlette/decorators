/**
 * @module alias
 *
 * This module provides simple Stage 3 Decorators for creating aliases between
 * different class members.
 *
 * The `@alias` decorator can be used to create multiple aliases at once, and
 * should be applied to the target member that is being aliased, and provided
 * with a list of alias names that should be created for that member.
 *
 * The `@alias.for` decorator can be used to create single aliases and should
 * be applied directly to the actual alias, rather than to the target member
 * that it is aliasing.
 *
 * You can customize the behavior of the `@alias` decorator by setting the
 * `alias.strategy` property to one of the following values:
 * - `"copy"`: Copies the value of the target member to the alias.
 * - `"reference"`: Creates a reference to the target member from the alias.
 *   > Only really applies to methods (including accessors/getters/setters),
 *   > and to fields that have objects/arrays/functions as their values.
 *   > Otherwise it's effectively the same as `"copy"`.
 * - `"accessor"`: Creates a getter/setter pair for the alias that delegates
 *   reading and writing to/from the target member that it is aliasing.
 *   > This is the default behavior.
 *
 * @example
 * ```ts
 * import { alias } from "@decorators/alias";
 *
 * class Example {
 *   // declaring our two aliases ahead of time to make typescript happy
 *   declare foo: this["bar"];
 *   declare baz: this["bar"];
 *
 *   @ alias("foo", "baz")
 *   bar(): string {
 *     return "Hello, World!";
 *   }
 * }
 *
 * const example = new Example();
 *
 * console.log(example.foo()); // "Hello, World!"
 * console.log(example.baz()); // "Hello, World!"
 * console.log(example.bar()); // "Hello, World!"
 * console.log(example.foo === example.baz); // true
 * ```
 *
 * @example
 * ```ts
 * import { alias } from "@decorators/alias";
 *
 * class Example {
 *   greeting = "Hello, World!";
 *
 *   // creates an alias for the `greeting` property
 *   @ alias.for("greeting")
 *   foo: string;
 *
 *   @ alias("greet")
 *   question() {
 *     return this.greeting + " What's up?";
 *   }
 * }
 *
 * const example = new Example();
 *
 * console.log(example.foo); // "Hello, World!"
 * console.log(example.greeting); // "Hello, World!"
 * console.log(example.foo === example.greeting); // true
 *
 * console.log(example.greet()); // "Hello, World! What's up?"
 * console.log(example.question()); // "Hello, World! What's up?"
 * console.log(example.greet === example.question); // true
 * ```
 */

/**
 * Creates one or more aliases for the class member that this decorator is
 * applied to. The aliases do not necessarily need to exist at the time of
 * decoration, but if they do exist, they must be configurable and their
 * parent class instance must be extensible (not sealed or frozen). If they do
 * _not_ exist, the class needs to have those properties declared in its type
 * definition in order to prevent compilation errors.
 *
 * @param aliases The names of the aliases to create for the decorated member.
 * @returns A decorator function that can be applied to class members, such as
 * fields, methods, accessors, getters, and setters.
 * @example
 * ```ts
 * class Example {
 *   // declaring our two aliases ahead of time to make typescript happy
 *   declare foo: this["bar"];
 *   declare baz: this["bar"];
 *
 *   @ alias.as("foo", "baz")
 *   bar(): string {
 *     return "Hello, World!";
 *   }
 * }
 *
 * const example = new Example();
 *
 * console.log(example.foo()); // "Hello, World!"
 * console.log(example.baz()); // "Hello, World!"
 * console.log(example.bar()); // "Hello, World!"
 * console.log(example.foo === example.baz); // true
 * ```
 */
export function alias<
  This extends object,
  Value,
  Name extends PropertyKey & keyof This,
  const Aliases extends readonly PropertyKey[] = readonly (keyof This)[],
>(...aliases: Aliases): {
  (
    target: ClassAccessorDecoratorTarget<This, Value>,
    context: ClassAccessorDecoratorContext<This, Value> & { name: Name },
  ): ClassAccessorDecoratorResult<This, Value>;
  (
    target: undefined,
    context: ClassFieldDecoratorContext<This, Value> & { name: Name },
  ): (this: This, initialValue: Value) => Value;
  (
    target: (this: This, newValue: Value) => void,
    context:
      & ClassSetterDecoratorContext<This, (this: This, newValue: Value) => void>
      & { name: Name },
  ): void;
  (
    target: (this: This) => Value,
    context: ClassGetterDecoratorContext<This, (this: This) => Value> & {
      name: Name;
    },
  ): void;
  (
    target: Value & ((this: This, ...args: unknown[]) => unknown),
    context:
      & ClassMethodDecoratorContext<
        This,
        Value & ((this: This, ...args: unknown[]) => unknown)
      >
      & { name: Name },
  ): void;
  (target: unknown, context: DecoratorContext & { name: Name }): void;
};

/** @ignore */
export function alias<
  This extends object,
  Value,
  Name extends PropertyKey & keyof This,
  const Aliases extends readonly PropertyKey[] = readonly (keyof This)[],
>(...aliases: Aliases): (target: unknown, context: DecoratorContext) => void {
  // deno-lint-ignore no-explicit-any
  return (target, context): any => {
    const { name, addInitializer, kind } = context;
    if (kind === "class") {
      throw new TypeError(
        `The @alias decorator cannot be used directly on classes: it's designed only to create aliases between class \x1b[3;4mmembers\x1b[0m.`,
      );
    }
    if (kind === "field") {
      return function (this: This, initialValue: Value) {
        const failures: PropertyKey[] = [];
        for (const $alias of aliases) {
          if (alias.strategy === "copy") {
            this[$alias as keyof typeof this] = initialValue as never;
            continue;
          } else if (alias.strategy === "reference") {
            const desc = Reflect.getOwnPropertyDescriptor(this, name);
            const ok = desc && Reflect.defineProperty(this, $alias, desc);
            if (ok) continue;
          }
          const ok = Reflect.defineProperty(this, $alias, {
            get(): Value {
              return Reflect.get(this, name) ?? initialValue;
            },
            set(value: Value) {
              Reflect.set(this, name, value);
            },
            enumerable: true,
            configurable: true,
          });
          if (!ok) failures.push($alias);
        }
        if (failures.length) {
          throwAliasFailure(failures.join("', '"), name);
        }
        return initialValue;
      };
    }

    // deno-lint-ignore no-explicit-any
    addInitializer(function (this: any) {
      const owner = resolveOwner(this, name);
      const failures: PropertyKey[] = [];
      let desc = Object.getOwnPropertyDescriptor(owner, name) ??
        { enumerable: false, configurable: true };
      for (const $alias of aliases) {
        if (alias.strategy === "reference") {
          if (kind === "method") {
            desc = {
              value: desc?.value ?? target,
              writable: true,
              enumerable: false,
              configurable: true,
            };
          } else if (kind === "accessor") {
            const { get, set } = target as ClassAccessorDecoratorTarget<
              This,
              Value
            >;
            desc = { ...desc, get, set };
          } else if (kind === "getter") {
            desc = { ...desc, get: target as (this: This) => Value };
          } else if (kind === "setter") {
            desc = {
              ...desc,
              set: target as (this: This, value: Value) => void,
            };
          } else {
            desc = { ...desc, value: target, writable: true };
          }
        } else if (alias.strategy === "copy") {
          desc = {
            ...desc,
            value: Reflect.get(owner, name) ?? target,
            writable: true,
          };
        } else {
          desc = {
            ...desc,
            get(this: This) {
              return Reflect.get(this, name) ?? target;
            },
            set(this: This, value: Value) {
              Reflect.set(this, name, value);
            },
          };
        }
        if (desc && ("get" in desc || "set" in desc)) {
          delete desc.value;
          delete desc.writable;
        } else if (desc) {
          delete desc.get;
          delete desc.set;
        }
        const ok = desc && Reflect.defineProperty(owner, $alias, desc);
        if (!ok) failures.push($alias);
      }
      if (failures.length) throwAliasFailure(failures.join("', '"), name);
    });
  };
}

/**
 * Creates an alias for the class method that this decorator is applied to.
 *
 * @param key The name of the alias to create for the decorated method.
 * @returns A decorator function that can be applied to class methods.
 * @example
 * ```ts
 * class Example {
 *   foo(): string {
 *     return "Hello, World!";
 *   }
 *
 *   @ alias.for("foo")
 *   bar(): string {
 *     return this.foo();
 *   }
 * }
 *
 * const example = new Example();
 *
 * console.log(example.foo()); // "Hello, World!"
 * console.log(example.bar()); // "Hello, World!"
 * console.log(example.foo === example.bar); // true
 * ```
 */
function aliasFor<
  This extends object,
  Value,
  Name extends PropertyKey & keyof This,
  Alias extends PropertyKey = keyof This,
>(key: Name): {
  (
    target: ClassAccessorDecoratorTarget<This, Value>,
    context: ClassAccessorDecoratorContext<This, Value> & { name: Alias },
  ): ClassAccessorDecoratorResult<This, Value>;
  (
    target: undefined,
    context: ClassFieldDecoratorContext<This, Value> & { name: Alias },
  ): (this: This, initialValue: Value) => Value;
  (
    target: (this: This, newValue: Value) => void,
    context:
      & ClassSetterDecoratorContext<This, (this: This, newValue: Value) => void>
      & { name: Alias },
  ): void;
  (
    target: (this: This) => Value,
    context: ClassGetterDecoratorContext<This, (this: This) => Value> & {
      name: Alias;
    },
  ): void;
  (
    target: Value & ((this: This, ...args: unknown[]) => unknown),
    context:
      & ClassMethodDecoratorContext<
        This,
        Value & ((this: This, ...args: unknown[]) => unknown)
      >
      & { name: Alias },
  ): void;
  (target: unknown, context: DecoratorContext & { name: Alias }): void;
};

/** @ignore */
function aliasFor<
  This extends object,
  Value,
  Name extends PropertyKey & keyof This,
  Alias extends PropertyKey = PropertyKey,
>(
  key: Name,
): (target: unknown, context: DecoratorContext & { name: Alias }) => void {
  // deno-lint-ignore no-explicit-any
  return (_target, context): any => {
    const { name, addInitializer } = context;
    if (context.kind === "class") {
      throw new TypeError(
        `The @alias decorator cannot be used on classes. It's only designed to alias one member to another, inside of a class.`,
      );
    }
    if (context.kind === "field") {
      return function (this: This, initialValue: unknown) {
        const failures: PropertyKey[] = [];

        if (alias.strategy === "copy") {
          this[key] = initialValue as never;
        } else if (alias.strategy === "reference") {
          const desc = Reflect.getOwnPropertyDescriptor(this, name);
          const ok = desc && Reflect.defineProperty(this, key, desc);
          if (!ok) failures.push(key);
        } else {
          const ok = Reflect.defineProperty(this, key, {
            get() {
              return Reflect.get(this, name) ?? (this[name] = initialValue);
            },
            set(value: unknown) {
              Reflect.set(this, name, value);
            },
            enumerable: true,
            configurable: true,
          });
          if (!ok) failures.push(key);
        }

        if (failures.length) {
          throwAliasFailure(failures.join("', '"), name);
        }

        return initialValue;
      };
    }
    if (context.kind === "accessor") {
      return {
        get(this: This) {
          const fallback = context.access.get(this);
          return Reflect.get(this, name) ?? fallback;
        },
        set(this: This, value: unknown) {
          const ok = Reflect.set(this, name, value);
          if (!ok) throwAliasFailure(key, name);
        },
      };
    }
    // deno-lint-ignore no-explicit-any
    addInitializer(function (this: any) {
      // const value = (this as This)[key] ?? (this as This)[name];
      const owner = resolveOwner(this, name);
      const desc = Object.getOwnPropertyDescriptor(owner, key);
      const ok = desc && Reflect.defineProperty(owner, name, desc);
      if (!ok) throwAliasFailure(key, name);
    });
  };
}

/**
 * Creates an alias for the class method that this decorator is applied to.
 *
 * @param key The name of the alias to create for the decorated method.
 * @returns A decorator function that can be applied to class methods.
 * @example
 * ```ts
 * class Example {
 *   foo(): string {
 *     return "Hello, World!";
 *   }
 *
 *   @ alias.for("foo")
 *   bar(): string {
 *     return this.foo();
 *   }
 * }
 *
 * const example = new Example();
 *
 * console.log(example.foo()); // "Hello, World!"
 * console.log(example.bar()); // "Hello, World!"
 * console.log(example.foo === example.bar); // true
 * ```
 */
alias.for = aliasFor;

export { aliasFor as for };

/**
 * The strategy to use when creating aliases between class members.
 *
 * - `"copy"`: Copies the value of the target member to the alias.
 * - `"reference"`: Creates a reference to the target member from the alias.
 *   > Only really applies to methods (including accessors/getters/setters),
 *   > and to fields that have objects/arrays/functions as their values.
 *   > Otherwise it's effectively the same as `"copy"`.
 * - `"accessor"`: Creates a getter/setter pair for the alias that delegates
 *   reading and writing to/from the target member that it is aliasing.
 *   > This is the default behavior.
 */
export type AliasStrategy = "copy" | "reference" | "accessor";

/**
 * The strategy to use when creating aliases between class members.
 *
 * - `"copy"`: Copies the value of the target member to the alias.
 * - `"reference"`: Creates a reference to the target member from the alias.
 *   > Only really applies to methods (including accessors/getters/setters),
 *   > and to fields that have objects/arrays/functions as their values.
 *   > Otherwise it's effectively the same as `"copy"`.
 * - `"accessor"`: Creates a getter/setter pair for the alias that delegates
 *   reading and writing to/from the target member that it is aliasing.
 *   > This is the default behavior.
 */
alias.strategy = "accessor" as AliasStrategy;

function throwAliasFailure(alias: PropertyKey, name: PropertyKey): never {
  // TODO(nberlette): review the compatibility/support of pretty error
  // messages
  const error = new TypeError(
    `\x1b[1;101m ERROR \x1b[0m Failed to create alias \x1b[4;93m'${
      String(alias)
    }'\x1b[0m ` +
      `to property \x1b[4;92m'${String(name)}'\x1b[0m.\n\n` +
      `\x1b[95mℹ\x1b[0;2;3m Ensure the desired alias does not exist (or is configurable)\n` +
      `and that its parent is extensible (neither sealed nor frozen).\x1b[0m`,
  );
  Error.captureStackTrace?.(error, throwAliasFailure);
  error.stack?.slice(); // access .stack to ensure it's captured
  throw error;
}

function resolveOwner<T extends object>(owner: T, property: PropertyKey): T {
  while (!Object.hasOwn(owner, property)) {
    const prev = owner;
    owner = Object.getPrototypeOf(owner);
    if (owner === null) {
      owner = prev;
      if (Object.hasOwn(owner, property)) break;
    }
  }
  return owner;
}

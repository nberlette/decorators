/**
 * @module bind
 *
 * The `@decorators/bind` module provides a Stage 3 Decorator to bind a class
 * method, getter, or setter to its parent class instance or constructor at
 * the time of initialization.
 *
 * If you find your class constructor body starting to look like a bunch of
 * `this.method = this.method.bind(this)`, this is the decorator for you!
 *
 * @example
 * ```ts
 * import { bind } from "@decorators/bind";
 *
 * class Example {
 *   #value = "Hello, world!";
 *
 *   ＠bind get greeting() {
 *     return this.#value;
 *   }
 *
 *   ＠bind setGreeting(value: string) {
 *     this.#value = value;
 *     return this;
 *   }
 * }
 *
 * const example = new Example();
 * console.log(example.greeting); // => "Hello, world!"
 *
 * const { setGreeting } = example;
 * setGreeting("Goodbye, world!");
 *
 * console.log(example.greeting); // => "Goodbye, world!"
 *
 * const clone = Object.create(null, {
 *   // normally, this would fail due to the getter having no `this` context.
 *   greeting: Object.getOwnPropertyDescriptor(example, "greeting"),
 * });
 *
 * console.log(clone.greeting); // => "Goodbye, world!"
 * ```
 *
 * @example
 * ```ts
 * import { bind } from "@decorators/bind";
 *
 * // demonstration of its usefulness when proxying
 * class Example {
 *   #value = "Hello, world!";
 *
 *   constructor() {
 *     // without the bind decorator...
 *     // 1. we would need to either create a this alias:
 *     // const self = this;
 *     return new Proxy(this, {
 *       // 2. or we would need to use an arrow function to access `this`:
 *       // set: (_, p, v, r) => return Reflect.set(this, p, v, r),
 *       // because this usage would throw an error:
 *       set(target, p, value, receiver) {
 *         return Reflect.set(target, p, value, receiver);
 *       },
 *     });
 *   }
 *   ＠bind set value(value: string) {
 *     this.#value = value;
 *   }
 * }
 *
 * const example = new Example();
 * example.value = "Goodbye, world!";
 * console.log(example.value); // ✔️ no error
 * ```
 */
function assert(
  condition: unknown,
  message?: string | Error,
  // deno-lint-ignore ban-types
  stackCrawlMark?: Function,
): asserts condition {
  if (!condition) {
    const error = message instanceof Error
      ? message
      : new TypeError(message ?? "Assertion failed.");
    Error.captureStackTrace?.(error, stackCrawlMark ?? assert);
    error.stack?.slice();
    throw error;
  }
}

/**
 * Sets the name of the given function to the provided value. This is
 * primarily used in binding-related utilities like the {@linkcode bind}
 * decorator, to ensure all bound functions have the same name as the original
 * target (rather than the default "bound " prefix).
 *
 * @param fn The function to set the name of.
 * @param value The new name to assign to the function.
 * @returns The function with the new name assigned.
 */
function setFunctionNameAndLength<
  T extends (...args: unknown[]) => unknown,
  K extends string,
  L extends number,
>(fn: T, name: K, length: L): T & { readonly name: K } {
  const nameOk = Reflect.defineProperty(fn, "name", {
    value: name,
    configurable: true,
  });
  assert(nameOk, "Cannot re-define non-configurable function name");

  const lengthOk = Reflect.defineProperty(fn, "length", {
    value: length,
    configurable: true,
  });
  assert(lengthOk, "Cannot re-define non-configurable function length");

  return fn as T & { readonly name: K };
}

/**
 * Stage 3 Decorator to bind a class method to its instance or constructor,
 * depending on whether it is an instance or a static method, respectively.
 *
 * This decorator uses the `addInitializer` context method to bind the target
 * method to the class / class constructor at the time of initialization.
 *
 * The actual binding is performed using the `Function.prototype.bind` method,
 * renaming the bound function to preserve the original method name. Finally,
 * the bound method is defined rather than assigned to the class, ensuring the
 * same property descriptor attributes are preserved.
 *
 * @param target The target method, getter, or setter to bind to the instance.
 * @param context The decorator context object.
 * @returns `void` if the binding was performed using the `addInitializer`
 * approach. Otherwise, returns the bound method, getter, or setter, that will
 * replace the original target function.
 * @example
 * ```ts
 * import bind from "@decorators/bind";
 *
 * class Example {
 *   #value = "Hello, world!";
 *
 *   ＠bind greet() {
 *     return this.#value;
 *   }
 *
 *   ＠bind setGreeting(value: string) {
 *     this.#value = value;
 *   }
 * }
 *
 * const example = new Example();
 * const { greet, setGreeting } = example;
 *
 * console.log(greet()); // => "Hello, world!"
 * setGreeting("Goodbye, world!"); // ✔️ no error
 * console.log(greet()); // => "Goodbye, world!"
 * ```
 */
// deno-lint-ignore no-explicit-any
export function bind<This, Value extends (this: This, ...args: any) => any>(
  method: Value,
  context: ClassMethodDecoratorContext<This, Value>,
): void;

/**
 * Stage 3 Decorator to bind a getter to the instance of a class, or to the
 * class constructor if the target is a static member.
 *
 * This is useful for hardening those getters that rely a private field value.
 * Using this decorator guarantees that you won't run into those pesky errors
 * like `Error: Cannot read private member #value from an object whose class
 * did not declare it`. You can safely subclass and proxy class instances with
 * confidence, knowing that getter is forever bound to the original instance.
 *
 * This decorator uses the `addInitializer` context method to bind the target
 * method to the class / class constructor at the time of initialization.
 *
 * The actual binding is performed using the `Function.prototype.bind` method,
 * renaming the bound function to preserve the original method name. Finally,
 * the bound method is defined rather than assigned to the class, ensuring the
 * same property descriptor attributes are preserved.
 *
 * @param target The target getter to bind to the instance.
 * @param context The decorator context object.
 * @returns nothing (`void`), since the binding is performed using initializer
 * callbacks rather than returning a new getter function.
 * @throws {TypeError} If the target is a private method.
 * @throws {TypeError} If the context is not a method context.
 * @example
 * ```ts
 * class Example {
 *   #value = "Hello, world!";
 *   ＠bind get value() {
 *     return this.#value;
 *   }
 * }
 *
 * const example = new Example();
 * console.log(example.value);
 * ```
 * @example
 * ```ts
 * // demonstration of its usefulness when proxying
 * class Example {
 *   #value = "Hello, world!";
 *   constructor() {
 *     // without the bind decorator...
 *     // 1. we would need to either create a this alias:
 *     // const self = this;
 *     return new Proxy(this, {
 *     // 2. or we would need to use an arrow function to access `this`:
 *     // get: (_, p, r) => return Reflect.get(this, p, r),
 *     // because this usage would throw an error:
 *       get(target, p, receiver) {
 *         return Reflect.get(target, p, receiver);
 *       },
 *     });
 *   }
 *   ＠bind get value() {
 *     return this.#value;
 *   }
 * }
 *
 * const example = new Example();
 * console.log(example.value);
 * ```
 */
export function bind<This, Value>(
  getter: (this: This) => Value,
  context: ClassGetterDecoratorContext<This, Value>,
): void;

/**
 * Stage 3 Decorator to bind a setter to the instance of a class, or to the
 * class constructor if the target is a static member.
 *
 * This is useful for hardening those setters that rely a private field value.
 * Using this decorator guarantees that you won't run into those pesky errors
 * like `Error: Cannot write private member #value to an object whose class
 * did not declare it`. You can safely subclass and proxy class instances with
 * confidence, knowing that setter is forever bound to the original instance.
 *
 * This decorator uses the `addInitializer` context method to bind the target
 * method to the class / class constructor at the time of initialization.  The
 * actual binding is performed using the `Function.prototype.bind` method,
 * renaming the bound function to preserve the original method name. Finally,
 * the bound method is defined rather than assigned to the class, ensuring the
 * same property descriptor attributes are preserved.
 *
 * @param target The target setter to bind to the instance.
 * @param context The decorator context object.
 * @returns nothing (`void`), since the binding is performed using initializer
 * callbacks rather than returning a new setter function.
 * @throws {TypeError} If the target is a private method.
 * @throws {TypeError} If the context is not a setter context.
 * @example
 * ```ts
 * class Example {
 *   #value = "Hello, world!";
 *   ＠bind set value(value: string) {
 *     this.#value = value;
 *   }
 * }
 *
 * const example = new Example();
 * example.value = "Goodbye, world!";
 * console.log(example.value);
 * ```
 * @example
 * ```ts
 * // demonstration of its usefulness when proxying
 * class Example {
 *   #value = "Hello, world!";
 *   constructor() {
 *     // without the bind decorator...
 *     // 1. we would need to either create a this alias:
 *     // const self = this;
 *     return new Proxy(this, {
 *     // 2. or we would need to use an arrow function to access `this`:
 *     // set: (_, p, v, r) => return Reflect.set(this, p, v, r),
 *     // because this usage would throw an error:
 *       set(target, p, value, receiver) {
 *         return Reflect.set(target, p, value, receiver);
 *       },
 *     });
 *   }
 *   ＠bind set value(value: string) {
 *     this.#value = value;
 *   }
 * }
 *
 * const example = new Example();
 * example.value = "Goodbye, world!";
 * console.log(example.value); // ✔️ no error
 * ```
 */
export function bind<This, Value>(
  getter: (this: This, value: Value) => void,
  context: ClassSetterDecoratorContext<This, Value>,
): void;

/**
 * Stage 3 Decorator to bind a class method to its instance or constructor,
 * depending on whether it is an instance or a static method, respectively.
 *
 * This decorator uses the `addInitializer` context method to bind the target
 * method to the class / class constructor at the time of initialization.
 *
 * The actual binding is performed using the `Function.prototype.bind` method,
 * renaming the bound function to preserve the original method name. Finally,
 * the bound method is defined rather than assigned to the class, ensuring the
 * same property descriptor attributes are preserved.
 *
 * @param target The target method, getter, or setter to bind to the instance.
 * @param context The decorator context object.
 * @returns `void` if the binding was performed using the `addInitializer`
 * approach. Otherwise, returns the bound method, getter, or setter, that will
 * replace the original target function.
 * @example
 * ```ts
 * import bind from "@decorators/bind";
 *
 * class Example {
 *   #value = "Hello, world!";
 *
 *   ＠bind greet() {
 *     return this.#value;
 *   }
 *
 *   ＠bind setGreeting(value: string) {
 *     this.#value = value;
 *   }
 * }
 *
 * const example = new Example();
 * const { greet, setGreeting } = example;
 *
 * console.log(greet()); // => "Hello, world!"
 * setGreeting("Goodbye, world!"); // ✔️ no error
 * console.log(greet()); // => "Goodbye, world!"
 * ```
 */
export function bind<This, Value>(
  target: (this: This, ...args: unknown[]) => unknown,
  context:
    | ClassMethodDecoratorContext<
      This,
      // deno-lint-ignore no-explicit-any
      Value & ((this: This, ...args: any) => any)
    >
    | ClassGetterDecoratorContext<This, Value>
    | ClassSetterDecoratorContext<This, Value>,
): void;

/**
 * Stage 3 Decorator to bind a class method to its instance or constructor,
 * depending on whether it is an instance or a static method, respectively.
 *
 * This decorator uses the `addInitializer` context method to bind the target
 * method to the class / class constructor at the time of initialization.
 *
 * The actual binding is performed using the `Function.prototype.bind` method,
 * renaming the bound function to preserve the original method name. Finally,
 * the bound method is defined rather than assigned to the class, ensuring the
 * same property descriptor attributes are preserved.
 *
 * @param target The target method, getter, or setter to bind to the instance.
 * @param context The decorator context object.
 * @returns `void` if the binding was performed using the `addInitializer`
 * approach. Otherwise, returns the bound method, getter, or setter, that will
 * replace the original target function.
 * @example
 * ```ts
 * import bind from "@decorators/bind";
 *
 * class Example {
 *   #value = "Hello, world!";
 *
 *   ＠bind get greeting() {
 *     return this.#value;
 *   }
 *
 *   ＠bind greet(message = "How are you?") {
 *     return this.#value + " " + message;
 *   }
 *
 *   ＠bind setGreeting(value: string) {
 *     this.#value = value;
 *   }
 * }
 *
 * const example = new Example();
 * const { greet, setGreeting } = example;
 *
 * console.log(greet()); // => "Hello, world! How are you?"
 * setGreeting("Goodbye, world!"); // ✔️ no error
 * console.log(greet("¡Hasta luego!")); // => "Goodbye, world! ¡Hasta luego!"
 * ```
 */
export function bind<This extends object, Value>(
  target: (this: This, ...args: unknown[]) => unknown,
  context:
    // deno-lint-ignore no-explicit-any
    | ClassMethodDecoratorContext<This, Value & ((...args: any) => any)>
    | ClassGetterDecoratorContext<This, Value>
    | ClassSetterDecoratorContext<This, Value>,
) {
  const { name, private: isPrivate, addInitializer } = context;
  assert(!isPrivate, "Cannot bind a class member with a #private identifier.");
  assert(
    ["method", "getter", "setter"].includes(context.kind),
    `Invalid decorator context kind '${context.kind}'. @bind can only be applied to class methods, getters, and setters.`,
  );
  switch (context.kind) {
    case "method":
      addInitializer(function initializeMethod() {
        assert(
          Reflect.isExtensible(this),
          "Cannot bind to a non-extensible class.",
          initializeMethod,
        );
        const value = setFunctionNameAndLength(
          target.bind(this),
          target.name,
          target.length,
        );
        const ok = Reflect.defineProperty(this, name, {
          value,
          writable: true,
          configurable: true,
        });
        assert(
          ok,
          "Cannot bind a non-configurable class method.",
          initializeMethod,
        );
      });
      break;
    case "getter":
      addInitializer(function initializeGetter() {
        assert(
          Reflect.isExtensible(this),
          "Cannot bind to a non-extensible class.",
          initializeGetter,
        );
        const owner = context.static ? this : this.constructor.prototype;
        const {
          set,
          enumerable = false,
        } = Reflect.getOwnPropertyDescriptor(owner, name) ?? {};
        const get = setFunctionNameAndLength(
          target.bind(this),
          target.name,
          target.length,
        );
        const ok = Reflect.defineProperty(this, name, {
          get,
          ...set ? { set } : {},
          configurable: true,
          enumerable,
        });
        assert(
          ok,
          "Cannot bind a non-configurable class getter.",
          initializeGetter,
        );
      });
      break;
    case "setter":
      addInitializer(function initializeSetter() {
        assert(
          Reflect.isExtensible(this),
          "Cannot bind to a non-extensible class.",
          initializeSetter,
        );
        const owner = context.static ? this : this.constructor.prototype;
        const {
          get,
          enumerable = false,
        } = Reflect.getOwnPropertyDescriptor(owner, name) ?? {};
        const set = setFunctionNameAndLength(
          target.bind(this),
          target.name,
          target.length,
        );
        const ok = Reflect.defineProperty(this, name, {
          set,
          ...get ? { get } : {},
          configurable: true,
          enumerable,
        });
        assert(
          ok,
          "Cannot bind non-configurable class setters.",
          initializeSetter,
        );
      });
      break;
  }
}

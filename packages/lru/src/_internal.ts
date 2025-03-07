// deno-lint-ignore-file no-explicit-any
import type { Keygen } from "./options.ts";
import type { CacheKey } from "./types.ts";

/**
 * Generic class method signature used by {@linkcode ClassMethodDecorator}.
 *
 * @category Types
 * @internal
 */
export type ClassMethod<
  This,
  Args extends readonly any[] = any[],
  Return = any,
> = (this: This, ...args: Args) => Return;

/**
 * Generic method decorator signature returned by the {@linkcode lru}
 * decorator.
 *
 * @category Types
 * @internal
 */
export type ClassMethodDecorator<This, Value extends ClassMethod<This>> = {
  (target: Value, ctx: ClassMethodDecoratorContext<This, Value>): Value | void;
};

/**
 * Custom extension of the native `ClassAccessorDecoratorContext` object, with
 * stronger type inference for the `name` property. Thanks to the significant
 * recent advancements TypeScript's type safety
 *
 * Which provides us with literal types for various properties of a decorator's
 * context object **_at compile time_**, we can simply drop this type in as a
 * replacement for the standard context object, giving us the ability to infer
 * literal property names of the item being decorated.
 */
export interface NamedAccessorDecoratorContext<
  This,
  Value,
  Name extends PropertyKey = PropertyKey,
> extends Omit<ClassAccessorDecoratorContext<This, Value>, "name"> {
  name: Name;
}

const JSON = globalThis.JSON;

/** @internal */
export const defaultKey: Keygen = (...args) => JSON.stringify(args) as CacheKey;

import { assert } from "./assert.ts";

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
export function setFunctionName<
  T extends (...args: unknown[]) => unknown,
  K extends string,
>(fn: T, value: K): T & { readonly name: K } {
  const ok = Reflect.defineProperty(fn, "name", {
    value,
    configurable: true,
  });
  assert(ok, "Cannot re-define non-configurable function name");
  return fn as T & { readonly name: K };
}

/**
 * Sets the length of the given function to the provided value. This is
 * primarily used in binding-related utilities like the {@linkcode bind}
 * decorator, to ensure all bound functions have the same length as the
 * original target.
 *
 * @param fn The function to set the length of.
 * @param value The new length to assign to the function.
 * @returns The function with the new length assigned.
 */
export function setFunctionLength<
  T extends (...args: unknown[]) => unknown,
  L extends number,
>(fn: T, value: L): T & { readonly length: L } {
  const ok = Reflect.defineProperty(fn, "length", {
    value,
    configurable: true,
  });
  assert(ok, "Cannot re-define non-configurable function length");
  return fn as T & { readonly length: L };
}

/**
 * Sets the properties of the given function to the provided values. This is
 * primarily used in binding-related utilities like the {@linkcode bind}
 * decorator, to ensure all bound functions have the same properties as the
 * original target.
 *
 * @param target The function to set the properties of.
 * @param source The source function with the desired own properties.
 * @returns The function with the new properties **defined** (not assigned).
 */
export function setFunctionProperties<
  T extends (...args: unknown[]) => unknown,
  U extends (...args: unknown[]) => unknown,
  R extends Record<string, unknown>,
>(target: T, source: U & R): T & R {
  for (const key of Reflect.ownKeys(source)) {
    const desc = Reflect.getOwnPropertyDescriptor(source, key);
    if (desc) Reflect.defineProperty(target, key, desc);
  }
  return target as T & R;
}

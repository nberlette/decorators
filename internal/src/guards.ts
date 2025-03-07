// deno-lint-ignore-file ban-types
/**
 * @module guards
 */
import type { unknowns } from "./types.ts";

const toString = globalThis.Object.prototype.toString;
const Symbol: typeof globalThis.Symbol = globalThis.Symbol;
const SymbolToStringTag: typeof Symbol.toStringTag = Symbol.toStringTag;

export function isObject(it: unknown): it is object {
  return typeof it === "object" && it !== null;
}

export function isFunction(it: unknown): it is Function {
  return typeof it === "function";
}

/**
 * Checks if the given value appears to be an object or function with the
 * expected `Object.prototype.toString` tag. This can be produced either
 * by a `Symbol.toStringTag` value, or internally by the JavaScript engine.
 *
 * This guard makes no attempts to verify the provenance or origin of the
 * tag value, it simply verifies that the value produces the expected tag.
 *
 * @param it The value to check.
 * @param tag The expected `Object.prototype.toString` tag (without `[object`, `]`).
 * @returns `true` if the value appears to be an object or function with the
 * expected `Object.prototype.toString` tag.
 * @example
 * ```ts
 * isTagged(new Error(), "Error"); // true
 * isTagged(new Array(), "Array"); // true
 * isTagged(new Map(), "Map"); // true
 * isTagged(new Set(), "Set"); // true
 * isTagged(new WeakMap(), "WeakMap"); // true
 * isTagged(new WeakSet(), "WeakSet"); // true
 * isTagged(new Date(), "Date"); // true
 * ```
 */
export function isTagged<T extends string>(
  it: unknown,
  tag: T,
): it is { [Symbol.toStringTag]: T } {
  return (isObject(it) || isFunction(it)) &&
    toString.call(it) === `[object ${tag}]`;
}

/**
 * Checks if the given value appears to be a native object with the given tag,
 * such as `Error`, `Array`, `Arguments`, etc.
 *
 * This builds on the `isTagged` function (which simply checks if a value is an
 * object/function that produces the expected `Object.prototype.toString` tag),
 * and adds an additional refinement step to verify that it does not have any
 * `Symbol.toStringTag` property. Only native objects are capable of producing
 * a custom `toStringTag` value without having a `Symbol.toStringTag` somewhere
 * in their prototype chain.
 *
 * @param it The value to check.
 * @param tag The expected `Object.prototype.toString` tag (without `[object`,
 * `]`).
 * @returns `true` if the value appears to be a native object with the given
 * tag.
 * @example
 * ```ts
 * isTaggedNative(new Error(), "Error"); // true
 * isTaggedNative(new Array(), "Array"); // true
 *
 * // despite being a native object, `Map` defines a `Symbol.toStringTag`:
 * isTaggedNative(new Map(), "Map"); // false
 *
 * (function foo(){
 *   // simple way to validate for an `Arguments` implementation:
 *   console.assert(isTaggedNative(arguments, "Arguments"));
 * })()
 * ```
 */
export function isTaggedNative<T, Tag extends string>(
  it: unknown,
  tag: Tag,
): it is T & { [Symbol.toStringTag]?: never } {
  return isTagged(it, tag) && typeof it[SymbolToStringTag] === "undefined";
}

/**
 * Checks if the given value appears to be a native `Error` object.
 */
export function isNativeError(x: unknown): x is Error {
  if ("isError" in Error && isFunction(Error.isError)) return Error.isError(x);
  return isTaggedNative(x, "Error");
}

/**
 * Checks if the given value appears to be an `Error` object.
 *
 * This is a more permissive check than `isNativeError`, which only checks for
 * native `Error` objects. This will also return true for any object that
 * inherits from `Error`, including custom error classes.
 *
 * @param it The value to check.
 * @returns `true` if the value appears to be an `Error` object.
 */
export function isError(it: unknown): it is Error {
  return isNativeError(it) || (isObject(it) && it instanceof Error);
}

/**
 * Checks if the given value appears to be a native `Array` object.
 *
 * This is a more permissive check than `isTagged`, which only checks for
 * native `Array` objects. This will also return true for any object that
 * inherits from `Array`, including custom array-like classes.
 *
 * @param it The value to check.
 * @returns `true` if the value appears to be an `Array` object.
 */
export function isArray(it: unknown): it is unknown[];
export function isArray<T>(it: ArrayLike<T> | unknowns): it is T[];
export function isArray<T>(
  it: ArrayLike<T> | unknowns,
  test: (it: unknown) => it is T,
): it is T[];
export function isArray<T>(
  it: unknown,
  test?: (it: unknown) => it is T,
): it is T[];
export function isArray<T>(
  it: unknown,
  test?: (it: unknown) => it is T,
): it is T[] {
  if (isTaggedNative(it, "Array")) {
    if (typeof test === "function") {
      const a = it as ArrayLike<T>;
      for (let i = 0; i < a.length; i++) {
        if (!test(a[i])) return false;
      }
    }
    return true;
  }
  return false;
}

export function isArguments(it: unknown): it is IArguments {
  return isTaggedNative(it, "Arguments");
}

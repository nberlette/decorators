import type { KeyOf } from "../_internal.ts";
import type { LegacyDecoratorArguments } from "./utilities.ts";

/**
 * Checks if the provided arguments are compatible with a legacy decorator
 * function, returning `true` if they are, and `false` if they are not.
 *
 * To check if the arguments are compatible with a Stage 3 Decorator function,
 * see {@link isDecoratorArguments} instead.
 *
 * @template {readonly unknown[]} A The tuple of decorator arguments.
 * @param args The tuple of decorator arguments to check.
 * @returns {args is LegacyDecoratorArguments} `true` if the arguments are
 * compatible with a legacy decorator function, `false` otherwise.
 * @category Utilities
 * @example
 * ```ts
 * import { isLegacyDecoratorArguments } from "@decorators/types";
 *
 * function decorator(...args: any[]) {
 *   if (isLegacyDecoratorArguments(args)) {
 *     // called as a legacy decorator with no args
 *     return decoratorLegacy(...args);
 *   } else {
 *     // called as a decorator factory with args
 *     return (target, key, descriptor) => decoratorLegacy(target, key, descriptor);
 *   }
 * }
 * ```
 */
export function isLegacyDecoratorArguments<
  This,
  Value,
  Key extends KeyOf<This & object> = KeyOf<This & object>,
>(args: unknown): args is LegacyDecoratorArguments<This, Value, Key>;

/**
 * Checks if the provided arguments are compatible with a legacy decorator
 * function, returning `true` if they are, and `false` if they are not.
 *
 * @template {readonly unknown[]} A The tuple of decorator arguments.
 * @param args The tuple of decorator arguments to check.
 * @returns {args is LegacyDecoratorArguments} `true` if the arguments are
 * compatible with a legacy decorator function, `false` otherwise.
 * @category Utilities
 */
export function isLegacyDecoratorArguments<const A extends readonly unknown[]>(
  args: [...A],
): args is [...Extract<A, LegacyDecoratorArguments<any, any, any>>];

/** @ignore */
export function isLegacyDecoratorArguments(
  args: unknown,
): args is LegacyDecoratorArguments {
  if (Array.isArray(args) && args.length > 0 && args.length < 4) {
    const [target, key, desc] = args;
    // [target]
    if (args.length === 1) return typeof target === "function";
    if (args.length === 2 && typeof key === "object" && key != null) {
      // fails fast if one of two args appears to be a context object
      // (since that is stage 3 decorator syntax only)
      return false;
    }
    return (
      // [target, key?, desc?]
      // argument 1 (target) must always be present, duh
      target != null &&
      // argument 2 (key) can be one of two types:
      // - string or symbol (property key, descriptor is optional)
      // - undefined (when targeting the class constructor function)
      //    -> the descriptor object must be present in this case!
      (typeof key === "string" || typeof key === "symbol" ||
        (key == null &&
          (typeof target === "function" ||
            typeof desc === "object" && desc != null))) &&
      // argument 3 (descriptor) can be one of three types:
      // - undefined (void, class decorators and property decorators)
      // - a number (parameter index for ParameterDecorators)
      // - PropertyDescriptor object (method / accessor decorators)
      (desc == null || typeof desc === "number" || (
        typeof desc === "object" && !Array.isArray(desc)
      ))
    );
  }

  // drop everything else like it's third period french
  return false;
}

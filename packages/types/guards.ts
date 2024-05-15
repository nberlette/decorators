// deno-lint-ignore-file no-explicit-any
import type { DecoratorArgsTypeMap } from "./_internal.ts";
import { isLegacyDecoratorArguments } from "./legacy/guards.ts";
import type { AnyDecoratorArguments, DecoratorArguments } from "./utilities.ts";

/**
 * Checks if the provided arguments are compatible with a Stage 3 Decorator
 * function, returning `true` if they are, and `false` if they are not.
 *
 * To check if the arguments are compatible with a legacy decorator function,
 * see {@link isLegacyDecoratorArguments} instead.
 *
 * @template {readonly unknown[]} A The tuple of decorator arguments.
 * @param args The tuple of decorator arguments to check.
 * @returns {args is DecoratorArguments} `true` if the arguments are compatible
 * with a Stage 3 decorator function, `false` otherwise.
 * @example
 * ```ts
 * import { isDecoratorArguments } from "@decorators/types";
 *
 * function decorator(...args: any[]) {
 *   if (isDecoratorArguments(args)) {
 *     // called as a Stage 3 decorator with no args
 *     return decoratorStage3(...args);
 *   } else {
 *     // called as a decorator factory with args
 *     return (target, context) => decoratorStage3(target, context);
 *   }
 * }
 * ```
 * @category Utilities
 */
export function isDecoratorArguments<const A extends readonly unknown[]>(
  args: [...A],
): args is [...Extract<A, DecoratorArguments<any, any>>];

/**
 * Checks if the provided arguments are compatible with a Stage 3 Decorator
 * function, returning `true` if they are, and `false` if they are not.
 *
 * To check if the arguments are compatible with a legacy decorator function,
 * see {@link isLegacyDecoratorArguments} instead.
 *
 * @template {readonly unknown[]} A The tuple of decorator arguments.
 * @param args The tuple of decorator arguments to check.
 * @returns {args is DecoratorArguments} `true` if the arguments are compatible
 * with a Stage 3 decorator function, `false` otherwise.
 * @example
 * ```ts
 * import { isDecoratorArguments } from "@decorators/types";
 *
 * function decorator(...args: any[]) {
 *   if (isDecoratorArguments(args)) {
 *     // called as a Stage 3 decorator with no args
 *     return decoratorStage3(...args);
 *   } else {
 *     // called as a decorator factory with args
 *     return (target, context) => decoratorStage3(target, context);
 *   }
 * }
 * ```
 * @category Utilities
 */
export function isDecoratorArguments<
  This,
  Value,
>(args: unknown): args is DecoratorArguments<This, Value>;

/** @ignore */
export function isDecoratorArguments(
  args: unknown,
): args is DecoratorArguments {
  if (Array.isArray(args) && args.length === 2) {
    const [target, context] = args;
    return isDecoratorContext(context) && isValidTarget(target, context);
  }
  return false;
}

/**
 * Checks if the provided arguments are compatible with **any** decorator type,
 * whether it be a Stage 3 decorator or a Legacy Stage 2 decorator. This uses a
 * logical OR of {@link isDecoratorArguments} and {@link isLegacyDecoratorArguments} to
 * determine if the arguments are compatible with either type of decorator.
 *
 * @template {readonly unknown[]} A The tuple of decorator arguments.
 * @param args The tuple of decorator arguments to check.
 * @returns {args is AnyDecoratorArguments} `true` if the arguments are
 * compatible with any decorator type, `false` otherwise.
 * @category Utilities
 */
export function isAnyDecoratorArguments<
  This,
  Value,
>(args: unknown): args is AnyDecoratorArguments<This, Value> {
  return isDecoratorArguments(args) || isLegacyDecoratorArguments(args);
}

/**
 * Checks if the provided context object is a valid decorator context object.
 *
 * **Note**: this is only compatible with Stage 3 decorators, and will return
 * `false` if used with legacy decorator arguments.
 *
 * @template {DecoratorContext} T The type of decorator context to check.
 * @param context The context object to check.
 * @returns {context is T} `true` if the context object is valid, `false` otherwise.
 */
export function isDecoratorContext<T extends DecoratorContext>(
  context: unknown,
): context is T {
  if (
    typeof context === "object" && context != null && !Array.isArray(context)
  ) {
    if (
      "kind" in context && "name" in context && "addInitializer" in context
    ) {
      const kinds = [
        "class",
        "field",
        "method",
        "getter",
        "setter",
        "accessor",
      ];
      const { kind, name, addInitializer } =
        (context ?? {}) as DecoratorContext;
      if (
        (typeof addInitializer !== "function") ||
        (typeof kind !== "string" || !kinds.includes(kind)) ||
        (
          typeof name !== "string" &&
          typeof name !== (
              // class decorators can have a `name` of `string | undefined`.
              // all others can be `string | symbol`.
              kind === "class" ? "undefined" : "symbol"
            )
        ) || (kind !== "class" && !(
          "private" in context && typeof context.private === "boolean" &&
          "static" in context && typeof context.static === "boolean" &&
          "access" in context && typeof context.access === "object" &&
          context.access != null && !Array.isArray(context.access)
        ))
      ) return false;
      const { access = {} } = context as ClassMemberDecoratorContext;
      return !(
        typeof access === "object" && access != null &&
        ("has" in access && typeof access.has === "function") &&
        (typeof (access as any).get === (
          ["accessor", "getter", "field", "method"].includes(kind) &&
            "get" in access
            ? "function"
            : "undefined"
        )) &&
        (typeof (access as any).set === (
          ["accessor", "setter", "field", "method"].includes(kind) &&
            "set" in access
            ? "function"
            : "undefined"
        ))
      );
    }
  }
  return false;
}

/**
 * Checks if the provided target is a valid target for the given decorator
 * context. This utility is useful for verifying that the target received by
 * an overloaded stage 3 decorator function is compatible with the context
 * object it receives as well.
 *
 * **Note**: this is only compatible with Stage 3 decorators, and will return
 * `false` if used with legacy decorator arguments.
 *
 * @template {DecoratorContext} T The type of decorator context to check.
 * @param target The target to check.
 * @param context The context object to check against
 * @returns {target is DecoratorArgsTypeMap[T["kind"]][0]} `true` if the target
 * is valid for the given context, `false` otherwise.
 * @category Utilities
 */
export function isValidTarget<const T extends DecoratorContext>(
  target: unknown,
  context: T,
): target is DecoratorArgsTypeMap[T["kind"]][0] {
  if (isDecoratorContext(context)) {
    switch (context.kind) {
      case "field":
        return typeof target === "undefined";
      case "accessor":
        return (
          typeof target === "object" && !!target && !Array.isArray(target) &&
          "get" in target && typeof target.get === "function" &&
          "set" in target && typeof target.set === "function"
        );
      default:
        return typeof target === "function";
    }
  }
  return false;
}

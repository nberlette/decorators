/**
 * @module types
 *
 * The `@decorators/types` package provides a collection of utility types and
 * runtime type guards for working with both modern and legacy decorators in a
 * TypeScript codebase. These types are designed to simplify the creation, use,
 * testing, and maintenance of decorators and decorator factories by providing
 * a consistent, well-documented, and type-safe foundation for their respective
 * API surfaces.
 *
 * An immediate use case for these types is to minimalize boilerplate code
 * required to define decorators that are cross-compatible with both the legacy
 * and stage 3 forms of the Decorators Proposal, as well as creating decorators
 * that are usable on multiple targets (e.g., classes, methods, fields, etc.).
 *
 * Such a task would typically involve creating a decorator factory that
 * returned a decorator with a specific signature for each of the supported
 * target types. This could quickly become cumbersome and error-prone without
 * some outside help; but with a package like `@decorators/types`, the process
 * suddenly becomes much more manageable:
 *
 * ```ts
 * import {
 *   isDecoratorArguments,
 *   isLegacyDecoratorArguments,
 *   type AnyDecoratorArguments,
 *   type AnyDecoratorReturn,
 * } from "@decorators/types";
 *
 * const log = <This, Value, const Args extends AnyDecoratorArguments<This, Value>>(
 *  prefix?: string
 * ): (...args: [...Args]) => AnyDecoratorReturn<Args> => {
 *   return (...args) => {
 *     if (isDecoratorArguments<This, Value>(args)) {
 *       // Stage 3 Decorators implementation ...
 *       // args -> [target, context]
 *       console.log(`[${prefix}] Initializing ${String(args[1].name?.toString())}`);
 *     } else if (isLegacyDecoratorArguments<This, Value>(args)) {
 *       // Legacy Decorators implementation ...
 *       // args -> [target, key, descriptor?]
 *       console.log(`[${prefix}] Initializing ${String(args[1].toString())}`);
 *     } else {
 *       throw new TypeError("Invalid decorator arguments");
 *     }
 *   };
 * };
 *
 * // the `log` decorator can now be used on any target type, in both
 * // legacy and stage 3 environments, with full type safety and consistency:
 *
 * @log("class") class Example {
 *   // ...
 *
 *   @log("method") method() { return "foo" }
 *
 *   @log("getter") get field() { return 42 }
 * }
 * ```
 */
export * from "./accessor.ts";
export * from "./class.ts";
export * from "./field.ts";
export * from "./getter.ts";
export * from "./guards.ts";
export * from "./legacy.ts";
export * from "./method.ts";
export * from "./setter.ts";
export * from "./signatures.ts";
export * from "./utilities.ts";

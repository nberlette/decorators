// deno-lint-ignore-file no-explicit-any

import type {
  AbstractConstructor,
  DecoratorTypeMap,
  MaybeVoidable,
  Or,
  ValueOf,
  VoidableArgument,
} from "./_internal.ts";
import type { ClassFieldDecoratorResult } from "./field.ts";
import type { ClassMethod } from "./method.ts";
import type { ClassGetter } from "./getter.ts";
import type { ClassSetter } from "./setter.ts";
import type {
  LegacyDecoratorArguments,
  LegacyDecoratorName,
  LegacyDecoratorReturn,
  LegacyDecoratorThis,
  LegacyDecoratorValue,
} from "./legacy/utilities.ts";

/**
 * Represents all possible arguments that can be used in decorator of any
 * type.
 * @category Signatures
 */
export type DecoratorArguments<
  This = object,
  Value = unknown,
> = Readonly<Parameters<ValueOf<DecoratorTypeMap<This, Value>>>>;

/**
 * Represents all possible arguments that can be passed to a decorator
 * function or a legacy decorator function.
 * @category Signatures
 */
export type AnyDecoratorArguments<
  This = object,
  Value = unknown,
> =
  | DecoratorArguments<This, Value>
  | LegacyDecoratorArguments<This, Value>;

/**
 * Resolves the contextual `this` type for a decorator function, based on
 * arguments provided in the {@linkcode A} tuple. If the contextual `this`
 * type cannot be resolved, the {@linkcode Fallback} type (default: `unknown`)
 * is returned instead. This utility is useful for inferring the type of the
 * `this` context for a decorator function.
 *
 * **Note**: this is specifically for Stage 3 decorators, and is not capable
 * of handling the arguments of legacy decorator functions. To extract the
 * `this` type from **_legacy_** arguments, see
 * {@link LegacyDecoratorThis}.
 *
 * @template {readonly unknown[]} A The tuple of decorator arguments.
 * @template [Fallback=unknown] Type to use if `this` cannot be resolved.
 * @category Signatures
 */
// deno-fmt-ignore
export type DecoratorThis<A extends readonly unknown[], Fallback = unknown> =
  | A extends readonly [infer _, infer T extends object]
    ? T extends ClassDecoratorContext<infer C extends abstract new (...args: any) => any> ? C
    : T extends ClassAccessorDecoratorContext<infer This, any> ? This
    : T extends ClassFieldDecoratorContext<infer This, any> ? This
    : T extends ClassGetterDecoratorContext<infer This, any> ? This
    : T extends ClassMethodDecoratorContext<infer This, any> ? This
    : T extends ClassSetterDecoratorContext<infer This, any> ? This
    : Fallback
  : Fallback;

/**
 * Resolves the contextual `this` type for a decorator function, based on
 * arguments provided in the {@linkcode A} tuple. If the contextual `this`
 * type cannot be resolved, the {@linkcode Fallback} type (default: `unknown`)
 * is returned instead. This utility is useful for inferring the type of the
 * `this` context for a decorator (or legacy decorator) function that accepts
 * multiple types of overloaded arguments.
 *
 * @template {readonly unknown[]} A The tuple of decorator arguments.
 * @template [Fallback=unknown] Type to use if `this` cannot be resolved.
 * @category Signatures
 */
export type AnyDecoratorThis<
  A extends readonly unknown[],
  Fallback = unknown,
> = Or<DecoratorThis<A, never>, Or<LegacyDecoratorThis<A, never>, Fallback>>;

/**
 * Resolves the decorated member's value type for a stage 3 decorator
 * function, based on arguments provided in the {@linkcode A} tuple. If the
 * value type cannot be resolved, the {@linkcode Fallback} type (default:
 * `unknown`) is returned instead.
 *
 * **Note**: this is specifically for Stage 3 decorators, and is not capable
 * of handling the arguments of legacy decorator functions. To extract the
 * value type from **_legacy_** arguments, see
 * {@link LegacyDecoratorValue}.
 *
 * @template {readonly unknown[]} A The tuple of decorator arguments.
 * @template [Fallback=unknown] Type to use if the value type cannot be
 * resolved.
 * @category Signatures
 */
// deno-fmt-ignore
export type DecoratorValue<A extends readonly unknown[], Fallback = unknown> =
  | A extends readonly [unknown, infer T extends object] // [infer B, infer T]
    ? T extends ClassDecoratorContext<infer C extends abstract new (...args: any) => any> ? C
    : T extends ClassAccessorDecoratorContext<unknown, infer V> ? V
    : T extends ClassFieldDecoratorContext<unknown, infer V> ? V
    : T extends ClassGetterDecoratorContext<unknown, infer V> ? V
    : T extends ClassSetterDecoratorContext<unknown, infer V> ? V
    : T extends ClassMethodDecoratorContext<unknown, infer V> ? V
    : Fallback
  : Fallback;

/**
 * Resolves the decorated member's value type for a decorator function, based
 * on arguments provided in the {@linkcode A} tuple. If the value type cannot
 * be resolved, the {@linkcode Fallback} type (default: `unknown`) is returned
 * instead. This utility is useful for inferring the type of the value being
 * decorated by a decorator.
 *
 * @template {readonly unknown[]} A The tuple of decorator arguments.
 * @template [Fallback=unknown] Type to use if the value type cannot be
 * resolved.
 * @category Signatures
 */
// deno-fmt-ignore
export type AnyDecoratorValue<A extends readonly unknown[], Fallback = unknown> =
  (
    | DecoratorValue<A, never>
    | LegacyDecoratorValue<A, never>
  ) extends infer V ? [V] extends [never] ? Fallback : V : Fallback;

/**
 * Resolves the key of the decorated member for a decorator function, based on
 * arguments provided in the {@linkcode A} tuple. If the key cannot be
 * resolved, the {@linkcode Fallback} type (default: `string | symbol |
 * undefined`) is returned instead. This utility is useful for inferring the
 * property key of the class member, or the name of the class itself in the
 * case of a ClassDecoratorFunction, that is being decorated with a decorator.
 *
 * @template {readonly unknown[]} A The tuple of decorator arguments.
 * @template [Fallback=string | symbol | undefined] Type to use if the key
 * cannot be resolved.
 * @category Signatures
 */
// deno-fmt-ignore
export type DecoratorName<A extends readonly unknown[], Fallback = string | symbol | undefined> =
  | A extends readonly [any, { name: infer N extends string | symbol }] ? N
  : A extends readonly [any, { name: infer N extends string | undefined }] ? N
  : A extends readonly [any, { name: string | symbol | undefined }] ? A[1]["name"]
  : Fallback;

/**
 * Resolves the key of the decorated member for a decorator function, based on
 * arguments provided in the {@linkcode A} tuple. If the key cannot be resolved,
 * the {@linkcode Fallback} type (default: `string | symbol | undefined`) is
 * returned instead. This utility is useful for inferring the property key of
 * the class member, or the name of the class itself in the case of a ClassDecoratorFunction,
 * that is being decorated with a decorator.
 * @template {readonly unknown[]} A The tuple of decorator arguments.
 * @template [Fallback=string | symbol | undefined] Type to use if the key cannot be resolved.
 * @category Signatures
 */
export type AnyDecoratorName<
  A extends readonly unknown[],
  Fallback = string | symbol | undefined,
> = (
  | DecoratorName<A, never>
  | LegacyDecoratorName<A, never>
) extends infer V ? [V] extends [never] ? Fallback : V : Fallback;

/**
 * Represents the return type of a decorator function.
 *
 * @template A The tuple of decorator arguments.
 * @template Void Controls the decorator return type, allowing for the
 * inclusion or exclusion of the `void` type. If set to `true`, return types
 * will include the `void` union member. If false, the `void` member will be
 * excluded. If set to `void`, the return type will be `void`. Default: `true`.
 * @category Signatures
 * @example
 * ```ts
 * import type {
 *   DecoratorReturn,
 *   ClassMethodDecoratorFunction,
 * } from "@decorators/types";
 *
 * type MyDecoratorReturn1 = DecoratorReturn<
 *   Parameters<ClassMethodDecoratorFunction<unknown, unknown>>
 * >; // => void | ((this: unknown, ...args: any[]) => unknown)
 *
 * type MyDecoratorReturn2 = DecoratorReturn<
 *   Parameters<ClassMethodDecoratorFunction<unknown, unknown>>,
 *   false, // exclude void from return types
 * >; // => (this: unknown, ...args: any[]) => unknown
 *
 * type MyDecoratorReturn3 = DecoratorReturn<
 *   Parameters<ClassMethodDecoratorFunction<unknown, unknown>>,
 *   void, // only include void in return types
 * >; // => void
 * ```
 * @example
 * ```ts
 * import type {
 *   DecoratorReturn,
 *   LegacyClassDecoratorFunction,
 * } from "@decorators/types";
 *
 * class FoobarClass {}
 *
 * type MyLegacyDecoratorReturn = DecoratorReturn<
 *   Parameters<LegacyClassDecoratorFunction<FoobarClass>>
 * >; // => void | typeof FoobarClass
 *
 * type MyLegacyDecoratorReturn2 = DecoratorReturn<
 *   Parameters<LegacyClassDecoratorFunction<FoobarClass>>,
 *   true, // enable legacy fallback
 *   false, // exclude void from return types
 * >; // => typeof FoobarClass
 * ```
 */
// deno-fmt-ignore
export type DecoratorReturn<
  A extends readonly unknown[],
  Void extends VoidableArgument = true,
  Fallback = unknown,
> =
  | [A] extends [[any, ClassMethodDecoratorContext<infer This, infer Value>]]
    ? [Value] extends [(this: This, ...args: infer Args) => infer Return]
      ? MaybeVoidable<ClassMethod<This, Args, Return>, Void>
    : Fallback
  : [A] extends [[any, ClassGetterDecoratorContext<infer This, infer Value>]]
    ? MaybeVoidable<ClassGetter<This, Value>, Void>
  : [A] extends [[any, ClassSetterDecoratorContext<infer This, infer Value>]]
    ? MaybeVoidable<ClassSetter<This, Value>, Void>
  : [A] extends [[any, ClassAccessorDecoratorContext<infer This, infer Value>]]
    ? MaybeVoidable<ClassAccessorDecoratorResult<This, Value>, Void>
  : [A] extends [[undefined, ClassFieldDecoratorContext<infer This, infer Value>]]
    ? MaybeVoidable<ClassFieldDecoratorResult<This, Value>, Void>
  : [A] extends [
      [AbstractConstructor, ClassDecoratorContext<infer Class extends abstract new (...args: any) => any>]
    ] ? MaybeVoidable<Class, Void>
  : Fallback;

/**
 * Determines the return type of a given decorator function based on arguments
 * it receives. This utility is useful for inferring the return type of a
 * decorator function that accepts multiple decorator types.
 *
 * @template {readonly unknown[]} A The tuple of decorator arguments.
 * @template [Void=true] If set to true, return types will include the
 * `void` union member. If false, the `void` member will be excluded. If
 * `void`, **only** `void` is included in the return type. Default is `true`.
 * @template [Fallback=unknown] Type to use if the return type cannot be found.
 * @category Signatures
 */
// deno-fmt-ignore
export type AnyDecoratorReturn<
  A extends readonly unknown[],
  Void extends VoidableArgument = true,
  Fallback = unknown,
> = (
  | LegacyDecoratorReturn<A, Void, never>
  | DecoratorReturn<A, Void, never>
) extends infer V ? [V] extends [never] ? Fallback : V : Fallback;

export type {
  LegacyDecoratorName,
  LegacyDecoratorReturn,
  LegacyDecoratorThis,
  LegacyDecoratorValue,
};

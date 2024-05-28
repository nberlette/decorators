// deno-lint-ignore-file ban-types no-explicit-any

import type {
AbstractConstructor,
  Is,
  KeyOf,
  LegacyDecoratorTypeMap,
  MaybeVoidable,
  ValueOf,
} from "../_internal.ts";

export type LegacyDecoratorKind = string & keyof LegacyDecoratorTypeMap;

/**
 * Represents a decorator with multiple overload signatures, configurable via
 * the {@linkcode Kind} type parameter.
 */
export interface LegacyOverloadedDecoratorFunction<
  Kind extends LegacyDecoratorKind = LegacyDecoratorKind,
  Voidable extends boolean | void = true,
> {
  <
    const Args extends Readonly<
      Parameters<LegacyDecoratorTypeMap<This, Value>[Kind]>
    >,
    This = LegacyDecoratorThis<Args>,
    Value = LegacyDecoratorValue<Args>,
  >(...args: Args): LegacyDecoratorReturn<Args, Voidable>;
}

/**
 * Represents all possible arguments that can be used in a legacy decorator
 * function of any type.
 * @category Arguments
 */
export type LegacyDecoratorArguments<
  This = any,
  Value = any,
  Key extends KeyOf<Is<This, object>> = KeyOf<Is<This, object>>,
> = Readonly<Parameters<ValueOf<LegacyDecoratorTypeMap<This, Value, Key>>>>;

/**
 * Represents the signature of all the possible types of legacy (stage 2)
 * experimental decorators. By using the type parameters on this utility type,
 * you can specify the types of the `this` context, the target member's value
 * being decorated as well as that member's key (if applicable).
 *
 * @template [This=unknown] The type of the `this` context for the decorator.
 * @template [Value=unknown] The type of the target member being decorated.
 * @template [Key=PropertyKey] The type of the key for the target member.
 * @category Legacy Decorators
 * @category Signatures
 */
export type LegacyDecoratorFunction<
  This = unknown,
  Value = unknown,
  Key extends KeyOf<Is<This, object>> = KeyOf<Is<This, object>>,
> = ValueOf<LegacyDecoratorTypeMap<This, Value, Key>>;

/**
 * Resolves the contextual `this` type for a legacy decorator function, based
 * on arguments provided in the {@linkcode A} tuple. If the contextual `this`
 * type cannot be resolved, the {@link Fallback} type (default: `unknown`) is
 * returned instead.
 *
 * **Note**: this is specifically for legacy (stage 2) decorators, and is not
 * capable of handling the arguments of Stage 3 decorators. To extract the
 * `this` type from **_Stage 3_** arguments, see
 * {@link DecoratorThis}.
 *
 * @template {readonly unknown[]} A The tuple of decorator arguments.
 * @template [Fallback=unknown] Type to use if `this` cannot be resolved.
 * @category Signatures (Legacy)
 */
// deno-fmt-ignore
export type LegacyDecoratorThis<A extends readonly unknown[], Fallback = unknown> =
  | A extends readonly [infer V extends Function] ? V
  : A extends readonly [infer T extends object, string | symbol | undefined] ? T
  : A extends readonly [infer T extends object, string | symbol, PropertyDescriptor | void] ? T
  : Fallback;

/**
 * Resolves the decorated member's value type for a legacy decorator function,
 * based on arguments provided in the {@linkcode A} tuple. If the value type
 * cannot be resolved, the {@linkcode Fallback} type (default: `unknown`) is
 * returned instead. This utility is useful for inferring the type of the
 * value being decorated by a legacy decorator.
 *
 * **Note**: this is specifically for legacy (stage 2) decorators, and is not
 * capable of handling the arguments of Stage 3 decorators. To extract the
 * value type from **_Stage 3_** arguments, see
 * {@link DecoratorValue}.
 *
 * @template {readonly unknown[]} A The tuple of decorator arguments.
 * @template [Fallback=unknown] Type to use if the value type cannot be
 * resolved.
 * @category Signatures (Legacy)
 */
// deno-fmt-ignore
export type LegacyDecoratorValue<A extends readonly unknown[], Fallback = unknown> =
  | [A] extends [never] ? Fallback
  : [A] extends readonly [[infer V extends AbstractConstructor]] ? V
  : [A] extends readonly [[any, string | symbol | undefined, TypedPropertyDescriptor<infer V>]] ? V
  : [A] extends readonly [[infer T, infer K extends string | symbol | undefined, ...([number | PropertyDescriptor | void | undefined] | [])]]
    ? [K] extends [keyof T] ? T[K]
    : [A[2]] extends [TypedPropertyDescriptor<infer V>] ? V
    : Fallback
  : [A] extends readonly [[infer T, infer K extends string | symbol]]
    ? [K] extends [keyof T] ? T[K] : Fallback
  : Fallback;

/**
 * Determines the return type of a legacy decorator function.
 *
 * @template A The tuple of decorator arguments.
 * @template Voidable If set to true, return types will include the `void`
 * union member. If false, the `void` member will be excluded. Default is
 * `true`.
 * @category Signatures
 * @example
 * ```ts
 * import type {
 *   LegacyDecoratorReturn,
 *   LegacyClassDecoratorFunction,
 * } from "@decorators/types";
 *
 * class FoobarClass {}
 *
 * type MyLegacyDecoratorReturn = LegacyDecoratorReturn<
 *   Parameters<LegacyClassDecoratorFunction<FoobarClass>>
 * >; // => void | typeof FoobarClass
 * ```
 */
// deno-fmt-ignore
export type LegacyDecoratorReturn<
  A extends readonly unknown[],
  Voidable extends boolean | void = true,
  Fallback = unknown,
> = A extends readonly [infer Class extends abstract new (...args: any) => any]
    ? MaybeVoidable<Class, Voidable>
  : A extends readonly [
      any,
      string | symbol | undefined,
      TypedPropertyDescriptor<infer Value> | void
    ] ? MaybeVoidable<TypedPropertyDescriptor<Value>, Voidable>
  : A extends (
    | readonly [any, string | symbol | undefined, number]
    | readonly [any, string | symbol]
   ) ? void
  : Fallback;

/**
 * Resolves the key of the decorated member for a legacy decorator function,
 * based on arguments provided in the {@linkcode A} tuple. If the key cannot
 * be resolved, the {@linkcode Fallback} type (default: `string | symbol |
 * undefined`) is returned instead. This utility is useful for inferring the
 * property key of the class member, or the name of the class itself in the
 * case of a ClassDecoratorFunction, that is being decorated with a legacy decorator.
 *
 * **Note**: this is specifically for legacy (stage 2) decorators, and is not
 * capable of handling the arguments of Stage 3 decorators. To extract the key
 * from **_Stage 3_** arguments, see {@link DecoratorName}.
 *
 * @template {readonly unknown[]} A The tuple of decorator arguments.
 * @template [Fallback=string | symbol | undefined] Type to use if the key
 * cannot be resolved.
 * @category Signatures (Legacy)
 */
// deno-fmt-ignore
export type LegacyDecoratorName<A extends readonly unknown[], Fallback = string | symbol | undefined> =
  | A extends readonly [any, string | symbol] ? A[1]
  : A extends readonly [any, string | symbol | undefined, PropertyDescriptor] ? A[1]
  : A extends readonly [any, string | symbol, number] ? A[1]
  : A[0] extends { name: infer N extends string | undefined } ? N
  : Fallback;

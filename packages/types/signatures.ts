// deno-lint-ignore-file no-explicit-any
import { __throw } from "./_internal.ts";
import type {
  AnyDecoratorTypeMap,
  Constructor,
  DecoratorTypeMap,
  Is,
  LegacyDecoratorTypeMap,
  ValueOf,
  VoidableArgument,
} from "./_internal.ts";
import type { ClassDecoratorFunction } from "./class.ts";
import type { ClassFieldDecoratorFunction } from "./field.ts";
import type { ClassAccessorDecoratorFunction } from "./accessor.ts";
import type { ClassMethod, ClassMethodDecoratorFunction } from "./method.ts";
import type { ClassGetterDecoratorFunction } from "./getter.ts";
import type { ClassSetterDecoratorFunction } from "./setter.ts";
import type {
  AnyDecoratorArguments,
  AnyDecoratorReturn,
  AnyDecoratorThis,
  AnyDecoratorValue,
  DecoratorArguments,
  DecoratorReturn,
  DecoratorThis,
  DecoratorValue,
} from "./utilities.ts";
import {
  LegacyDecoratorArguments,
  LegacyDecoratorKind,
  LegacyDecoratorReturn,
  LegacyDecoratorThis,
  LegacyDecoratorValue,
} from "./legacy.ts";

/**
 * Represents any of the possible types of decorators that can be applied to a
 * class or to class members. This is a union of all the other decorator
 * types.
 *
 * @template [This=unknown] The type on which the class element will be
 * defined. For a static class element, this is the type of the constructor.
 * For non-static class elements, this will be the type of the instance.
 * @template [Value=unknown] The type of the class member being decorated.
 * @category Decorators
 * @category Signatures
 */
export type DecoratorFunction<This = unknown, Value = unknown> =
  // coerce to AbstractConstructor to satisfy the type constraint
  | ClassDecoratorFunction<
    InstanceType<Is<This, Constructor>>,
    Is<This, Constructor>
  >
  // coerce to ClassMethod to satisfy the type constraint
  | ClassFieldDecoratorFunction<This, Value>
  | ClassAccessorDecoratorFunction<This, Value>
  | ClassGetterDecoratorFunction<This, Value>
  | ClassSetterDecoratorFunction<This, Value>
  | ClassMethodDecoratorFunction<This, Is<Value, ClassMethod<This>>>;

/**
 * Represents the "kind" of all possible Stage 3 Decorator types. This is used
 * to differentiate between the different types of decorators based on the
 * `kind` property of the context object.
 * @category Signatures
 */
export type DecoratorKind = string & keyof DecoratorTypeMap;

/**
 * Represents the "kind" of all possible decorators, both legacy and stage 3.
 * For Stage 3 decorators, the kind is derived from the `kind` property of the
 * context object. For Legacy decorators, which do not have a context object,
 * it is derived from the decorator's signature using the internal type map
 * `LegacyDecoratorTypeMap`.
 * @category Signatures
 */
export type AnyDecoratorKind = string & keyof AnyDecoratorTypeMap;

/**
 * Represents the signature of all the possible types of decorators that can
 * be applied to a class or to class members. This is a union of all the other
 * decorator types, including legacy decorators.
 *
 * @template [This=unknown] The type on which the class element will be
 * defined. For a static class element, this is the type of the constructor.
 * For non-static class elements, this will be the type of the instance.
 * @template [Value=unknown] The type of the class member being decorated.
 * @category Decorators
 * @category Signatures
 */
export type AnyDecoratorFunction<
  This = unknown,
  Value = unknown,
> = ValueOf<AnyDecoratorTypeMap<This, Value>>;

/**
 * Represents a decorator with multiple overload signatures, configurable via
 * the {@linkcode Kind} type parameter.
 */
export interface OverloadedDecoratorFunction<
  Kind extends DecoratorKind = DecoratorKind,
  Void extends VoidableArgument = true,
> {
  <
    Args extends Parameters<DecoratorTypeMap<This, Value>[Kind]>,
    This = AnyDecoratorThis<Args>,
    Value = AnyDecoratorValue<Args>,
  >(...args: Args): DecoratorReturn<Args, Void>;
}

/**
 * Represents a decorator with multiple overload signatures, configurable via
 * the {@linkcode Kind} type parameter.
 */
export interface AnyOverloadedDecoratorFunction<
  Kind extends AnyDecoratorKind = AnyDecoratorKind,
  Void extends VoidableArgument = true,
> {
  <
    Args extends Parameters<AnyDecoratorTypeMap<This, Value>[Kind]>,
    This = AnyDecoratorThis<Args>,
    Value = AnyDecoratorValue<Args>,
  >(...args: Args): AnyDecoratorReturn<Args, Void>;
}

export interface DecoratorFactory<
  Outer extends readonly unknown[] = readonly any[],
  Void extends VoidableArgument = true,
> {
  <
    Inner extends DecoratorArguments<This, Value>,
    This = DecoratorThis<Inner>,
    Value = DecoratorValue<Inner>,
  >(...outer: Outer): (...inner: Inner) => DecoratorReturn<Inner, Void>;
}

export interface LegacyDecoratorFactory<
  Outer extends readonly unknown[] = readonly any[],
  Void extends VoidableArgument = true,
> {
  <
    Inner extends LegacyDecoratorArguments<This, Value>,
    This = LegacyDecoratorThis<Inner>,
    Value = LegacyDecoratorValue<Inner>,
  >(...outer: Outer): (...inner: Inner) => LegacyDecoratorReturn<Inner, Void>;
}

export interface AnyDecoratorFactory<
  Outer extends readonly unknown[] = readonly any[],
  Void extends VoidableArgument = true,
> {
  <
    Inner extends AnyDecoratorArguments<This, Value>,
    This = AnyDecoratorThis<Inner>,
    Value = AnyDecoratorValue<Inner>,
  >(...outer: Outer): (...inner: Inner) => AnyDecoratorReturn<Inner, Void>;
}

/**
 * Represents a factory function that creates a new decorator function with
 * the specified arguments. This is used to create decorator functions that
 * require additional arguments to be passed to them.
 *
 * @template [Args=any[]] The type of the additional arguments to be passed to
 * the decorator.
 * @category Decorators
 * @category Signatures
 */
export interface OverloadedDecoratorFactory<
  Outer extends readonly unknown[] = any[],
  Kind extends DecoratorKind = DecoratorKind,
  Void extends VoidableArgument = true,
> {
  /**
   * @template [This=unknown] The type on which the class element will be
   * defined. For a static class element, this is the type of the constructor.
   * For non-static class elements, this will be the type of the instance.
   * @template [Value=unknown] The type of the class member being decorated.
   */
  <
    Inner extends Parameters<DecoratorTypeMap<This, Value>[Kind]>,
    This = DecoratorThis<Inner>,
    Value = DecoratorValue<Inner>,
  >(...outer: Outer): (...inner: Inner) => DecoratorReturn<Inner, Void>;
}

/**
 * Represents a factory function that creates a new decorator function with
 * the specified arguments. This is used to create decorator functions that
 * require additional arguments to be passed to them.
 *
 * @template [Args=any[]] The type of the additional arguments to be passed to
 * the decorator.
 * @category Decorators
 * @category Signatures
 */
export interface LegacyOverloadedDecoratorFactory<
  Outer extends readonly unknown[] = any[],
  Kind extends LegacyDecoratorKind = LegacyDecoratorKind,
  Void extends VoidableArgument = true,
> {
  /**
   * @template [This=unknown] The type on which the class element will be
   * defined. For a static class element, this is the type of the constructor.
   * For non-static class elements, this will be the type of the instance.
   * @template [Value=unknown] The type of the class member being decorated.
   */
  <
    Inner extends Parameters<LegacyDecoratorTypeMap<This, Value>[Kind]>,
    This = LegacyDecoratorThis<Inner>,
    Value = LegacyDecoratorValue<Inner>,
  >(...outer: Outer): (...inner: Inner) => LegacyDecoratorReturn<Inner, Void>;
}

/**
 * Represents a factory function that creates a new decorator function with
 * the specified arguments. This is used to create decorator functions that
 * require additional arguments to be passed to them.
 *
 * @template [Args=any[]] The type of the additional arguments to be passed to
 * the decorator.
 * @category Decorators
 * @category Signatures
 */
export interface AnyOverloadedDecoratorFactory<
  Outer extends readonly unknown[] = any[],
  Kind extends AnyDecoratorKind = AnyDecoratorKind,
  Void extends VoidableArgument = true,
> {
  /**
   * @template [This=unknown] The type on which the class element will be
   * defined. For a static class element, this is the type of the constructor.
   * For non-static class elements, this will be the type of the instance.
   * @template [Value=unknown] The type of the class member being decorated.
   */
  <
    Inner extends Parameters<AnyDecoratorTypeMap<This, Value>[Kind]>,
    This = AnyDecoratorThis<Inner>,
    Value = AnyDecoratorValue<Inner>,
  >(...outer: Outer): (...inner: Inner) => AnyDecoratorReturn<Inner, Void>;
}

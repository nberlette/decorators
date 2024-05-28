/**
 * @module field
 *
 * This module provides types for working with class field decorators
 * according to the latest version of the TC39 Decorators Proposal (now at
 * Stage 3).
 *
 * The types in this module provide a structured and well-documented
 * foundation for creating consistent field decorators with easily predictable
 * behavior.
 *
 * @example
 * ```ts
 * import type { ClassFieldDecoratorFunction } from "@decorators/types/field";
 *
 * const log = <T, V>(prefix: string): ClassFieldDecoratorFunction<T, V> => (_, context) => (initialValue) => {
 *   console.log(
 *     `[${prefix}] Initializing ${String(context.name)} with ${initialValue}`,
 *   );
 *   return initialValue;
 * };
 *
 * class Example {
 * @log("Example") static staticField = "static";
 * }
 * ```
 * @category Field Decorators
 */

/**
 * Represents the decorator signature applied to a class field. This is the
 * only decorator type that will always have `undefined` as its first
 * argument, and receives a {@linkcode ClassFieldDecoratorContext} object for
 * its second argument.
 *
 * Field decorators are able to return a custom initializer function, which
 * can be used to mutate or replace the original initial value of the field.
 * See the {@linkcode ClassFieldDecoratorResult} type for more information.
 *
 * @template This The type on which the class element will be defined. For a
 * static class element, this is the type of the constructor. For non-static
 * class elements, this will be the type of the instance.
 * @template Value The type of the class field's value.
 * @category Field Decorators
 */
export interface ClassFieldDecoratorFunction<
  This = unknown,
  Value = unknown,
  Return extends void | ClassFieldDecoratorResult<This, Value> =
    | void
    | ClassFieldDecoratorResult<This, Value>,
> {
  /**
   * @param target Always `undefined`.
   * @param context The context object for the class field decorator.
   * @returns Either `void` or a custom {@link ClassFieldDecoratorResult} to
   * initializer the field with a different value.
   */
  (
    target: undefined,
    context: ClassFieldDecoratorContext<This, Value>,
  ): Return;
}

/**
 * Represents the result of a class field decorator function. This is a custom
 * initializer function that can be used to modify or replace the initial
 * value of the field being decorated.
 *
 * Inside these custom initializer functions is **the only point** that
 * initial values of class field are accessible to the decorator, due to the
 * nature of the initialization process of classes fields by the ECMAScript
 * language. This is why the `target` parameter of field decorators is always
 * `undefined` - the field's value is not yet initialized when its decorators
 * are applied.
 *
 * If you'd like to access the value of a field before it's initialized, you
 * would probably benefit from using an auto-accessor instead of a classic
 * field. See the {@linkcode ClassAccessorDecoratorFunction} type for more information
 * on auto-accessors and how to use them.
 *
 * @template This The type on which the class element will be defined. For a
 * static class element, this is the type of the constructor. For non-static
 * class elements, this will be the type of the instance.
 * @template Value The type of the class field's value.
 * @category Field Decorators
 */
export interface ClassFieldDecoratorResult<This = unknown, Value = unknown> {
  /**
   * @this This The instance/constructor of the class being decorated.
   * @param initialValue The initial value of the field being decorated.
   * @returns The new value to be used as the initial field value.
   */
  (this: This, initialValue: Value): Value;
}

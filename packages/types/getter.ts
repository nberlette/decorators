/**
 * @module getter
 *
 * This module provides types for working with class getter decorators
 * according to the latest version of the TC39 Decorators Proposal (now at
 * Stage 3).
 *
 * The types in this module provide a structured and well-documented
 * foundation for creating consistent getter decorators with easily
 * predictable behavior.
 *
 * @example
 * ```ts
 * import type { ClassGetterDecoratorFunction } from "@decorators/types/getter";
 *
 * const log = <T, V>(): ClassGetterDecoratorFunction<T, V> =>
 *   (target, context) => {
 *     return function () {
 *       const value = target.call(this);
 *       console.log(`Getting ${String(context.name)} ... ${value}`);
 *       return value;
 *     };
 *   };
 *
 * class Example {
 *   #field = "value";
 *
 * @log() get field() { return this.#field;
 *   }
 * }
 *
 * const example = new Example();
 *
 * example.field; // logs "Getting field ... value"
 * ```
 */

/**
 * Represents a getter method on a class that is being decorated, regardless
 * of whether its static/instance and public/private.
 *
 * @template [This=unknown] The type on which the class element will be
 * defined. For a static class element, this is the type of the constructor.
 * For non-static class elements, this will be the type of the instance.
 * @template [Value=unknown] The type of the getter's return value.
 * @category Getter Decorators
 */
export interface ClassGetter<This = unknown, Value = unknown> {
  (this: This): Value;
}

/**
 * Represents the decorator signature applied to a class getter member.
 *
 * #### What are getters?
 *
 * A getter is a special type of method that is used to read the value of a
 * property. It is defined using the `get` keyword, followed by an identifier
 * and a block of code that returns the value of the property.
 *
 * ### Target Argument
 *
 * The `target` argument is the getter method itself, and is a function that
 * receives no arguments and returns the value of the property.
 *
 * ### Context Argument
 *
 * The `context` argument is a {@linkcode ClassGetterDecoratorContext} object
 * containing the metadata and other information about the getter being
 * decorated. It's `kind` property will always be `"getter"`.
 *
 * Similar to the other decorator types, it also includes an `addInitializer`
 * method, `name` and `metadata` properties. And like all class member
 * decorators, it also has `access`, `static`, and `private` properties.
 *
 * ### Return Value
 *
 * The return value of a getter decorator may either be `void` (if no changes
 * are needed), or a new getter function to replace the original getter.
 *
 * @template This The type on which the class element will be defined. For a
 * static class element, this is the type of the constructor. For non-static
 * class elements, this will be the type of the instance.
 * @template Value The type of the class getter.
 * @category Getter Decorators
 */
export interface ClassGetterDecoratorFunction<
  This = unknown,
  Value = unknown,
  Return extends void | ClassGetter<This, Value> =
    | void
    | ClassGetter<This, Value>,
> {
  (
    target: ClassGetter<This, Value>,
    context: ClassGetterDecoratorContext<This, Value>,
  ): Return;
}

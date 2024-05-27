/**
 * @module setter
 *
 * This module provides types for working with class setter decorators according
 * to the latest version of the TC39 Decorators Proposal (now at Stage 3).
 *
 * The types in this module provide a structured and well-documented foundation
 * for creating consistent setter decorators with easily predictable behavior.
 *
 * @example
 * ```ts
 * import type { ClassSetterDecoratorFunction } from "@decorators/types/setter";
 *
 * const log = <T, V>(): ClassSetterDecoratorFunction<T, V> =>
 *  (target, context) => {
 *    return function (newValue) {
 *      console.log(`Setting ${String(context.name)} to ${newValue}`);
 *      target.call(this, newValue);
 *    };
 *  };
 *
 * class Example {
 *   #field = "value";
 *
 *   @log() set field(newValue: string) {
 *     this.#field = newValue;
 *   }
 * }
 *
 * const example = new Example();
 *
 * example.field = "new value"; // logs "Setting field to new value"
 * ```
 * @category Setter Decorators
 */

/**
 * Represents a setter method on a class that is being decorated, regardless
 * of whether its static/instance and public/private.
 *
 * @template [This=unknown] The type on which the class element will be defined. For a
 * static class element, this is the type of the constructor. For non-static
 * class elements, this will be the type of the instance.
 * @template [Value=unknown] The type of the setter's argument.
 * @category Setter Decorators
 */
export interface ClassSetter<This = unknown, Value = unknown> {
  (this: This, newValue: Value): void;
}

/**
 * Represents the decorator signature applied to a class setter member.
 *
 * #### What are setters?
 *
 * A setter is a special type of method that is used to write the value of a
 * property. It is defined using the `set` keyword, followed by an identifier
 * and a block of code that sets the value of the property.
 *
 * #### Param: `target`
 *
 * The `target` argument is the setter method itself, and is a function that
 * receives the new value of the property as its only argument.
 *
 * #### Param: `context`
 *
 * The `context` argument is a {@linkcode ClassSetterDecoratorContext} object
 * containing the metadata and other information about the setter being
 * decorated. It's `kind` property will always be `"setter"`.
 *
 * Similar to the other decorator types, it also includes an `addInitializer`
 * method, `name` and `metadata` properties. And like all class member
 * decorators, it also has `access`, `static`, and `private` properties.
 *
 * #### Returned Value
 *
 * The return value of a setter decorator may either be `void` (if no changes
 * are needed), or a new setter function to replace the original setter.
 *
 * @template This The type on which the class element will be defined. For a
 * static class element, this is the type of the constructor. For non-static
 * class elements, this will be the type of the instance.
 * @template Value The type of the class setter's expected value.
 * @category Setter Decorators
 */
export interface ClassSetterDecoratorFunction<
  This = unknown,
  Value = unknown,
  Return extends void | ClassSetter<This, Value> =
    | void
    | ClassSetter<This, Value>,
> {
  (
    target: ClassSetter<This, Value>,
    context: ClassSetterDecoratorContext<This, Value>,
  ): Return;
}

/**
 * @module method
 *
 * This module provides types for working with method decorators according to
 * the latest version of the TC39 Decorators Proposal (now at Stage 3).
 *
 * The types in this module provide a structured and well-documented
 * foundation for creating consistent method decorators with easily
 * predictable behavior.
 *
 * @example
 * ```ts
 * import type { ClassMethod, ClassMethodDecoratorFunction } from "@decorators/types/method";
 *
 * const bind = <T, V extends ClassMethod<T>>(): ClassMethodDecoratorFunction<T, V, void> =>
 *  (target, context) => {
 *    context.addInitializer(function() {
 *      this[context.name] = this[context.name].bind(this);
 *    });
 *  };
 *
 * class Example {
 *   #field = "value";
 *
 * @bind() method() { return this.#field;
 *   }
 * }
 *
 * const example = new Example(); const method = example.method;
 *
 * console.log(method()); // logs "value"
 * ```
 * @category Method Decorators
 */

/**
 * Represents a method on a class that is being decorated, whether its static
 * or an instance method, public or private.
 *
 * @template [This=unknown] The type on which the class element will be
 * defined. For a static class element, this is the type of the constructor.
 * For non-static class elements, this will be the type of the instance.
 * @template [Args=any[]] The type of the method's arguments.
 * @template [Return=unknown] The type of the method's return value.
 * @category Method Decorators
 */
export interface ClassMethod<
  This = unknown,
  // deno-lint-ignore no-explicit-any
  Args extends readonly unknown[] = any[],
  Return = unknown,
> {
  (this: This, ...args: Args): Return;
}

/**
 * Represents the decorator signature applied to a class method.
 *
 * ### Target Argument
 *
 * The `target` argument is the method itself, and is a function that receives
 * the same arguments as the method, and returns the same value as the method.
 *
 * ### Context Argument
 *
 * The `context` argument is a {@linkcode ClassMethodDecoratorContext} object
 * containing the metadata and other information about the method being
 * decorated. It's `kind` property will always be `"method"`.
 *
 * Similar to the other decorator types, it also includes an `addInitializer`
 * method, `name` and `metadata` properties. And like all class member
 * decorators, it also has `access`, `static`, and `private` properties.
 *
 * ### Return Value
 *
 * The return value of a method decorator may either be `void` (if no changes
 * are needed), or a new function to replace the one being decorated.
 *
 * @template [This=unknown] The type on which the class element will be
 * defined. For a static class element, this is the type of the constructor.
 * For non-static class elements, this will be the type of the instance.
 * @template [Value=ClassMethod<This>] The type of the class method.
 * @template [Return=void|Value] The return type of the method decorator. For
 * decorators that return a new, replacement method, the return type will be
 * the same as the method being decorated (since they must maintain the same
 * signature). For decorators that do not return a value, this will be `void`.
 * Defaults to `void | Value`, meaning both of those scenarios are allowed.
 * @category Method Decorators
 */
export interface ClassMethodDecoratorFunction<
  This = unknown,
  Value extends ClassMethod<This> = ClassMethod<This>,
  Return extends void | Value = void | Value,
> {
  /**
   * @param target The method itself.
   * @param context The context object for the method decorator.
   * @returns Either `void` or a new method function to replace the original.
   * The type of the returned value is controlled by the `Return` type param
   * on the {@link ClassMethodDecoratorFunction} interface.
   */
  (
    target: Value,
    context: ClassMethodDecoratorContext<This, Value>,
  ): Return;
}

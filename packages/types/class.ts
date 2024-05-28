/**
 * @module class
 *
 * This module provides types for working with class decorators according to
 * the latest version of the TC39 Decorators Proposal (now at Stage 3).
 *
 * The types in this module provide a structured and well-documented foundation
 * for creating consistent class decorators with easily predictable behavior.
 *
 * @example
 * ```ts
 * import type { ClassDecoratorFunction } from "@decorators/types/class";
 *
 * const log = <T>(prefix: string): ClassDecoratorFunction<T> => (target, context) => {
 *   console.log(`[${prefix}] Initializing ${String(context.name)}`);
 * };
 *
 * @log("Example")
 * class Example {
 *   // ...
 * }
 * ```
 * @category Class Decorators
 */
import type { Constructor } from "./_internal.ts";

/**
 * Represents a class decorator function's signature.
 *
 * #### Target Argument
 *
 * The `target` argument is the class constructor itself. This is the only
 * type of decorator that receives a constructor as its first argument.
 *
 * #### Context Argument
 *
 * The `context` argument is a {@linkcode ClassDecoratorContext} object, which
 * contains the metadata and other information about the class being
 * decorated.  The `kind` property of this object will always be `"class"`.
 * The `name` property will be the name of the class being decorated, or
 * `undefined` if it is an anonymous class / class expression. The
 * `addInitializer` method (found in all decorator context objects) allows the
 * registration of callback functions that will then be executed at the time
 * of initialization. The `this` context binding will be the class constructor
 * in this instance.
 *
 * It also has a `metadata` property, which is shared across all decorators
 * applied to the same class, and goes on to become the `[Symbol.metadata]`
 * property of the class constructor once all decorators have been applied.
 *
 * @template {AbstractClass<Proto>} Class The type of the class
 * constructor. This is the type of the {@link target} argument, and will be
 * the type of the contextual `this` binding for any hooks registered with the
 * {@linkcode addInitializer} method, as well as any static class members.
 * @template {object} [Proto=object] The type of the class prototype. This is
 * the type of the contextual `this` binding for any instance class members,
 * as well as the body of the class itself and its constructor function.
 * @template {void | Class} [Return=void|Class] The return type of the class
 * decorator function. This may be `void` if the decorator does not need to
 * return a replacement constructor; otherwise it **must** return the same type
 * of constructor as the original class it is decorating (or a subclass
 * thereof). No additional properties may be added by a decorator, unless they
 * were already present on the original class prior to decoration.
 * @category Class Decorators
 */
export interface ClassDecoratorFunction<
  Proto extends object = object,
  Class extends Constructor<Proto> = Constructor<Proto>,
  Return extends void | Class = void | Class,
> {
  (target: Class, context: ClassDecoratorContext<Class>): Return;
}

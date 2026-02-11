/**
 * @module accessor
 *
 * This module provides types for working with class auto-accessors according
 * to the latest version of the TC39 Decorators Proposal (now at Stage 3).
 *
 * The types in this module provide a structured and well-documented
 * foundation for creating consistent auto-accessor decorators with easily
 * predictable behavior. Auto-accessors are a new type of class member
 * introduced in the latest version of the Decorators Proposal, and introduce
 * a new `accessor` keyword, which scaffolds a `getter`/`setter` pair backed
 * by a private field to store the value.
 *
 * @example
 * ```ts
 * import type { ClassAccessorDecoratorFunction } from "@decorators/types/accessor";
 *
 * const log = <T, V>(prefix: string): ClassAccessorDecoratorFunction<T, V> =>
 *   (_, context) => {
 *      console.log(`[${prefix}] Initializing ${String(context.name)}`);
 *   };
 *
 * class Example {
 * @log("Example") accessor field = "value";
 * }
 * ```
 * @category Auto-Accessor Decorators
 */

/**
 * Represents the decorator signature applied to a class auto-accessor member.
 *
 * #### What are auto-accessors?
 *
 * The latest form of the Decorators Proposal introduces a brand new type of
 * class member and an entirely new `"accessor"` keyword. These members are
 * known as "auto-accessors", and their decorators are "auto-accessor
 * decorators".
 *
 * These behave just like a regular class field at runtime, but are backed by
 * a private field to store the value. This allows the decorator to access the
 * field's value at runtime, and also to replace the field's value with a new
 * value.
 *
 * The purpose of this new language feature is to provide a remedy for the
 * shortcomings of field decorators, which are explained in the comments on
 * the {@linkcode ClassFieldDecoratorFunction} type. Auto-accessors seek to provide an
 * alternative solution that offers the functionality that field decorators
 * lack, while behaving **_close_** to how a standard field behaves at
 * runtime.
 *
 * It's important to note that **these are not fields**. They are auto-created
 * getters / setters that are backed by a private field for storage.
 *
 * ### Target Argument
 *
 * This is the only type of decorator that receives an object for its target
 * argument, which is a special descriptor-style object containing the
 * original `get` and `set` methods of the auto-accessor.
 *
 * ### Context Argument
 *
 * The `context` argument is a {@linkcode ClassAccessorDecoratorContext}
 * object containing the metadata and other information about the
 * auto-accessor being decorated. It's `kind` property will always be
 * `"accessor"`.
 *
 * Similar to the other decorator types, it also includes an `addInitializer`
 * method, `name` and `metadata` properties. And like all class member
 * decorators, it also has `access`, `static`, and `private` properties.
 *
 * Since the `target` argument has a `get` and a `set` property, you can
 * expect to find a `has`, `get`, and `set` method on the `context.access`
 * object.
 *
 * ### Return Value
 *
 * The return value of an auto-accessor decorator may either be `void` (if no
 * changes are needed), or a {@linkcode ClassAccessorDecoratorResult} object.
 * This is an object similar to the target object, with `get` and/or `set`
 * methods, and also optionally an `init` method.
 *
 * These optional methods are used to replace the original `get` or `set`
 * methods, or to provide a custom initialization function for the
 * auto-accessor's private backing field, respectively. The `init` method
 * shares the same signature as {@linkcode ClassFieldDecoratorResult}.
 *
 * @template This The type on which the class element will be defined. For a
 * static class element, this is the type of the constructor. For non-static
 * class elements, this will be the type of the instance.
 * @template Value The type of the class auto-accessor's value.
 * @category Auto-Accessor Decorators
 */
export interface ClassAccessorDecoratorFunction<
  This = unknown,
  Value = unknown,
  Return extends void | ClassAccessorDecoratorResult<This, Value> =
    | void
    | ClassAccessorDecoratorResult<This, Value>,
> {
  /**
   * @param target The descriptor-style object containing the original `get`
   * and `set` methods of the auto-accessor.
   * @param context The context object for the auto-accessor decorator.
   * @returns Either `void` or a {@link ClassAccessorDecoratorResult} object.
   */
  (
    target: ClassAccessorDecoratorTarget<This, Value>,
    context: ClassAccessorDecoratorContext<This, Value>,
  ): Return;
}

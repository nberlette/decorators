import type {
  AbstractConstructor,
  AccessorPropertyDescriptor,
  KeyOf,
} from "../_internal.ts";

/**
 * Represents a ClassFieldDecorator function in the legacy Stage 2 syntax.
 *
 * This type of decorator requires the compiler option
 * `experimentalDecorators` be explicitly set to `true` in your
 * `tsconfig.json` or `deno.json` file in TypeScript v5.0 and later. It is not
 * recommended for use in new code.
 *
 * @template This The type of the class instance or constructor function.
 * @template Value The type of the class field value.
 * @template Key The type of the class field key.
 * @category Legacy Decorators
 * @module legacy:accessor
 */
export interface LegacyAccessorDecoratorFunction<
  This extends object = object | AbstractConstructor<object>,
  // deno-lint-ignore no-explicit-any
  Value = any,
  Key extends KeyOf<This> = KeyOf<This>,
> {
  <T extends This, K extends Key, V extends Value>(
    target: T,
    key: K,
    descriptor: AccessorPropertyDescriptor<V>,
  ): AccessorPropertyDescriptor<V>;
  (
    target: This,
    key: Key,
    descriptor: AccessorPropertyDescriptor<Value>,
  ): AccessorPropertyDescriptor<Value>;
}

import type { AbstractConstructor, KeyOf } from "../_internal.ts";

/**
 * Represents a PropertyDecorator function in the legacy Stage 2 syntax.
 *
 * This type of decorator requires the compiler option
 * `experimentalDecorators` be explicitly set to `true` in your
 * `tsconfig.json` or `deno.json` file in TypeScript v5.0 and later. It is not
 * recommended for use in new code.
 *
 * @template This The type of the class instance or constructor function.
 * @template Key The type of the class property key.
 * @category Legacy Decorators
 * @module legacy:property
 */
export interface LegacyPropertyDecoratorFunction<
  This extends object = object | AbstractConstructor<object>,
  Key extends KeyOf<This> = KeyOf<This>,
> {
  (target: This, key: Key): void;
}

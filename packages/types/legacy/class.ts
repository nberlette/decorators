import type { Constructor } from "../_internal.ts";

/**
 * Represents a ClassDecorator function in the legacy Stage 2 syntax.
 *
 * This type of decorator requires the compiler option
 * `experimentalDecorators` be explicitly set to `true` in your
 * `tsconfig.json` or `deno.json` file in TypeScript v5.0 and later. It is not
 * recommended for use in new code.
 *
 * @template Class The type of the class instance or constructor function.
 * @category Legacy Decorators
 * @module legacy:class
 */
export interface LegacyClassDecoratorFunction<
  Proto extends object = object,
  Class extends Constructor<Proto> = Constructor<Proto>,
  Return extends void | Class = void | Class,
> {
  (target: Class): Return;
}

import type { AbstractConstructor, FunctionKeys, KeyOf } from "../_internal.ts";

/**
 * Represents a ParameterDecorator function in the legacy Stage 2 syntax.
 *
 * This type of decorator requires the compiler option
 * `experimentalDecorators` be explicitly set to `true` in your
 * `tsconfig.json` or `deno.json` file in TypeScript v5.0 and later. It is not
 * recommended for use in new code.
 *
 * @template Target The type of the class instance or constructor function.
 * @template Key The type of the class method key.
 * @category Legacy Decorators
 * @module parameter
 */
export interface LegacyParameterDecoratorFunction<
  Target extends object = object | AbstractConstructor<object>,
  Key extends KeyOf<Target> = FunctionKeys<Target>,
> {
  (target: Target, key: Key, parameterIndex: number): void;
}

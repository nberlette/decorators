// deno-lint-ignore-file no-explicit-any

import type { ClassAccessorDecoratorFunction } from "./accessor.ts";
import type { ClassDecoratorFunction } from "./class.ts";
import type { ClassFieldDecoratorFunction } from "./field.ts";
import type { ClassGetterDecoratorFunction } from "./getter.ts";
import type { LegacyAccessorDecoratorFunction } from "./legacy/accessor.ts";
import type { LegacyClassDecoratorFunction } from "./legacy/class.ts";
import type { LegacyMethodDecoratorFunction } from "./legacy/method.ts";
import type { LegacyParameterDecoratorFunction } from "./legacy/parameter.ts";
import type { LegacyPropertyDecoratorFunction } from "./legacy/property.ts";
import type { ClassMethod, ClassMethodDecoratorFunction } from "./method.ts";
import type { ClassSetterDecoratorFunction } from "./setter.ts";
import type {
  Constructor,
  Is,
  KeyOf,
  ValueOf,
} from "@decorators/internal/types";
export * from "@type/union";
export * from "@decorators/internal/assert";
export * from "@decorators/internal/types";
export type { Is } from "@decorators/internal/types";

/**
 * Extracts the Parameters of a given decorator.
 */
export type DecoratorParameters<T, Fallback = never> = T extends
  (...args: infer A) => any
  ? Is<Readonly<A>, Readonly<Parameters<ValueOf<AnyDecoratorTypeMap>>>>
  : Fallback;

export interface DecoratorTypeMap<
  This = any,
  Value = any,
> {
  "class": ClassDecoratorFunction<
    InstanceType<Is<This, Constructor>>,
    Is<This, Constructor>
  >;
  "field": ClassFieldDecoratorFunction<This, Value>;
  "accessor": ClassAccessorDecoratorFunction<This, Value>;
  "getter": ClassGetterDecoratorFunction<This, Value>;
  "setter": ClassSetterDecoratorFunction<This, Value>;
  "method": ClassMethodDecoratorFunction<This, Is<Value, ClassMethod<This>>>;
}

export interface LegacyDecoratorTypeMap<
  This = any,
  Value = any,
  Key extends KeyOf<Is<This, object>> = KeyOf<Is<This, object>>,
> {
  "legacy:class": LegacyClassDecoratorFunction<
    InstanceType<Is<This, Constructor>>,
    Is<This, Constructor>
  >;
  "legacy:parameter": LegacyParameterDecoratorFunction<Is<This, object>, Key>;
  "legacy:field": LegacyPropertyDecoratorFunction<Is<This, object>, Key>;
  "legacy:accessor": LegacyAccessorDecoratorFunction<
    Is<This, object>,
    Value,
    Key
  >;
  "legacy:method": LegacyMethodDecoratorFunction<Is<This, object>, Value, Key>;
}

export type AnyDecoratorTypeMap<
  This = any,
  Value = any,
  Key extends KeyOf<Is<This, object>> = KeyOf<Is<This, object>>,
> =
  & DecoratorTypeMap<This, Value>
  & LegacyDecoratorTypeMap<This, Value, Key>;

export type DecoratorArgsTypeMap<
  This = any,
  Value = any,
  Key extends KeyOf<Is<This, object>> = KeyOf<Is<This, object>>,
  AsEntries extends boolean = false,
  Map extends Record<string | number, any> = AnyDecoratorTypeMap<
    This,
    Value,
    Key
  >,
> = {
  readonly [P in keyof Map]-?: [AsEntries] extends [true]
    ? [Map[P], Readonly<Parameters<Map[P]>>]
    : Readonly<Parameters<Map[P]>>;
} extends infer V ? V : never;

export function __throw(error: string | Error): never {
  error = typeof error === "string" ? new Error(error) : error;
  Error.captureStackTrace?.(error, __throw);
  error.stack?.slice();
  throw error;
}

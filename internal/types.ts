// deno-lint-ignore-file no-explicit-any
/**
 * @module types
 *
 * This module provides internal utility types used throughout various projects
 * in the `@decorators` namespace. These types are not intended for direct use
 * by end users, but are instead used internally to provide type safety and
 * consistency across the various projects and modules. They're located in this
 * module to avoid redundancy and improve maintainability.
 *
 * @see https://jsr.io/@decorators for more information and a full list of the
 * available packages offered by the `@decorators` project namespace. Thanks!
 */

export const BRAND: unique symbol = Symbol("BRAND");
export type BRAND = typeof BRAND;

export const NEVER: unique symbol = Symbol("NEVER");
export type NEVER = typeof NEVER;

/**
 * Represents a unique brand for a type, which can be used to create nominal
 * types in TypeScript and prevent type collisions. For a less-strict version
 * of this type, see the {@linkcode Flavor} interface.
 *
 * To create a branded type, you can either use the {@linkcode Branded} helper
 * type, or manually extend/intersect another type with this interface. The
 * {@linkcode A} type parameter is the type that becomes the brand's value, and
 * it defaults to `never`.
 */
export interface Brand<B = never> {
  readonly [BRAND]: B;
}

export type Branded<V, T, B = NEVER> = [B] extends [NEVER] ? V & Brand<T>
  : V | Branded<T, B>;

export interface Flavor<F> {
  readonly [BRAND]?: F | void;
}

export type Flavored<V, T, F = NEVER> = [F] extends [NEVER] ? V & Flavor<T>
  : V | Flavored<T, F>;

export type properties = Flavored<PropertyKey, "properties">;

export type KeyOf<T, Strict extends boolean = false> =
  | (Strict extends true ? never : strings)
  | (string & keyof T);

export type AbstractConstructor<T = any, A extends readonly unknown[] = readonly any[]> = abstract new (...args: A) => T;

export type Constructor<T = any, A extends readonly unknown[] = readonly any[]> = {
  new (...args: A): T;
};

export type FunctionKeys<T> = keyof {
  [K in keyof T as T[K] extends (...args: any) => any ? K : never]: K;
};

/**
 * Represents an accessor method's property descriptor. which may only have a
 * getter and/or setter, a `configurable` flag, and an `enumerable` flag. The
 * `value` and `writable` flags are not allowed.
 *
 * @template T The type of the accessor's value.
 * @category Types
 */
export interface AccessorPropertyDescriptor<T = any> {
  get?(): T;
  set?(value: T): void;
  configurable?: boolean;
  enumerable?: boolean;
}


export type As<T, U = unknown> = T extends U ? U extends T ? U : T
  : [T & U] extends [never] ? U & Omit<T, keyof U>
  : T & U;

export type Is<T, U = unknown> = Or<Extract<T, U>, U>;

//T extends U ? U extends T ? U : T
//   : [T & U] extends [never] ? U
//   : T & U;

const _: unique symbol = Symbol("_");
type _ = typeof _;

export type strings = string & { [_]?: "string" | void };

export type numbers = number & { [_]?: "number" | void };

export type symbols = symbol & { [_]?: "symbol" | void };

export type PropertyKeys = strings | numbers | symbols;

export type ValueOf<T> = T[keyof T];

export type PropKeys<T, Strict extends boolean = false> =
  | (Strict extends true ? never : properties)
  | (PropertyKey & keyof T);

export type Class<
  Prototype extends object | null = any,
  Args extends readonly unknown[] = readonly any[],
  Static extends {} = {},
> =
  & Constructor<Prototype, Args>
  & { readonly prototype: Prototype }
  & ({} extends Static ? unknown : {
    [K in keyof Static as [Static[K]] extends [never] ? never : K]:
      & ThisType<Class<Prototype, Args, Static>>
      & Static[K];
  });

export type Or<A, B> = ([A & {}] extends [never] ? B : A) extends
  infer V extends B ? V : never;

export type AbstractClass<
  Prototype extends object | null = any,
  Args extends readonly unknown[] = readonly any[],
  Static extends {} = {},
> =
  & AbstractConstructor<Prototype, Args>
  & { readonly prototype: Prototype }
  & (
    {} extends Static ? unknown
      : {
        [K in keyof Static as [Static[K]] extends [never] ? never : K]:
          & ThisType<AbstractClass<Prototype, Args, Static>>
          & Static[K];
      }
  );

// deno-fmt-ignore
export type ParametersOf<T, Fallback extends readonly unknown[] = never> =
  | [T] extends [never] ? Fallback
  : readonly [...ParametersOfWorker<ValueOf<T>, Fallback>];

// deno-fmt-ignore
type ParametersOfWorker<T, Fallback extends readonly unknown[]> =
  | T extends (...args: infer A) => any ? Readonly<A> : Fallback;

export type Voidable<T> = T | void;

export type VoidableArgument = boolean | void;

export type MaybeVoidable<T, V extends VoidableArgument = true> = (
  | (void extends V ? void : T)
  | ([V] extends [never] ? void : V extends true ? void : never)
) extends infer U ? U : never;

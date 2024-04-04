export type As<T, U = unknown> = T extends U ? U extends T ? U : T
  : [T & U] extends [never] ? U & Omit<T, keyof U>
  : T & U;

export type Is<T, U> = [T] extends [never] ? [U] extends [never] ? never : U
  : T extends unknown ? U
  : T extends U ? T
  : U;

export const BRAND: unique symbol = Symbol("BRAND");
export type BRAND = typeof BRAND;

export const NEVER: unique symbol = Symbol("NEVER");
export type NEVER = typeof NEVER;

export interface Brand<B> {
  readonly [BRAND]: B;
}

export type Branded<V, T, B = NEVER> = [B] extends [NEVER] ? V & Brand<T>
  : V | Branded<T, B>;

export interface Flavor<F> {
  readonly [BRAND]?: F | void;
}

export type Flavored<V, T, F = NEVER> = [F] extends [NEVER] ? V & Flavor<T>
  : V | Flavored<T, F>;

// deno-lint-ignore ban-types
export type strings = string & {};

export type properties = Flavored<PropertyKey, "properties">;

export type KeyOf<T, Strict extends boolean = false> =
  | (Strict extends true ? never : strings)
  | (string & keyof T);

export type PropKeys<T, Strict extends boolean = false> =
  | (Strict extends true ? never : properties)
  | (PropertyKey & keyof T);

// deno-lint-ignore no-explicit-any
export type AbstractConstructor<T = any, A extends readonly unknown[] = any[]> =
  abstract new (...args: A) => T;

// deno-lint-ignore no-explicit-any
export type Constructor<T = any, A extends readonly unknown[] = any[]> = {
  new (...args: A): T;
};

export type FunctionKeys<T> = keyof {
  // deno-lint-ignore no-explicit-any
  [K in keyof T as T[K] extends (...args: any[]) => any ? K : never]: K;
};

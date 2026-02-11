// deno-lint-ignore-file no-explicit-any ban-types
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

/**
 * Represents a unique symbol that is used to create branded and flavored types
 * in TypeScript. This symbol is used to create nominal types and prevent type
 * collisions in the type system.
 * @see https://michalzalecki.com/nominal-typing-in-typescript/
 * @see {@linkcode Brand} for more information on branded types.
 * @see {@linkcode Branded} for a helper type that creates branded types.
 * @see {@linkcode Flavor} for more information on flavored types.
 * @see {@linkcode Flavored} for a helper type that creates flavored types.
 * @category Utility Types
 */
export const BRAND: unique symbol = Symbol("BRAND");

/**
 * Represents a unique symbol that is used to create branded and flavored types
 * in TypeScript. This symbol is used to create nominal types and prevent type
 * collisions in the type system.
 * @see https://michalzalecki.com/nominal-typing-in-typescript/
 * @see {@linkcode Brand} for more information on branded types.
 * @see {@linkcode Branded} for a helper type that creates branded types.
 * @see {@linkcode Flavor} for more information on flavored types.
 * @see {@linkcode Flavored} for a helper type that creates flavored types.
 * @category Utility Types
 */
export type BRAND = typeof BRAND;

/**
 * Represents a unique symbol that can be used to create a simulated partial
 * application of type parameters. This is useful for creating branded types
 * with a default value for a type parameter.
 * @category Utility Types
 */
export const NEVER: unique symbol = Symbol("NEVER");

/**
 * Represents a unique symbol that can be used to create a simulated partial
 * application of type parameters. This is useful for creating branded types
 * with a default value for a type parameter.
 * @category Utility Types
 */
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

/**
 * Creates a new branded type by intersecting the given type `V` with the
 * {@linkcode Brand} interface. This can be used to create nominal types in
 * TypeScript and prevent type collisions.
 *
 * This is an "overloaded" type that can be used in two ways:
 *   - If only two type arguments are provided, the first type `V` is branded
 *     with the second type `T` (e.g. `V & Brand<T>`).
 *   - If three type arguments are provided, the first type `V` is **unioned**
 *     with type `T`, which is branded with the third type `B`. This is useful
 *     for creating things like a string literal union with a brand type. It is
 *     equivalent to `V | Branded<T, B>`.
 *
 * @template V The type to brand with the given type `T`.
 * @template T The type to brand the given type `V` with.
 * @template [B=NEVER] The type that becomes the brand's value. Defaults to the
 * special `NEVER` type, which is a unique symbol that can be used to create a
 * simulated partial application of type parameters.
 * @category Utility Types
 */
export type Branded<V, T, B = NEVER> = [B] extends [NEVER] ? V & Brand<T>
  : V | Branded<T, B>;

/**
 * Represents a unique flavor for a type, which can be used to create nominal
 * types in TypeScript and prevent type collisions. For a stricter version of
 * this type, see the {@linkcode Brand} interface.
 *
 * To create a flavored type, you can either use the {@linkcode Flavored}
 * helper type, or manually extend/intersect another type with this interface.
 * The {@linkcode F} type parameter is the type that becomes the flavor's
 * value, and it defaults to `never`.
 */
export interface Flavor<F = never> {
  readonly [BRAND]?: F | void;
}

/**
 * Creates a new flavored type by intersecting the given type `V` with the
 * {@linkcode Flavor} interface. This can be used to create nominal types in
 * TypeScript and prevent type collisions.
 *
 * This is an "overloaded" type that can be used in two ways:
 *   - If only two type arguments are provided, the first type `V` is flavored
 *     with the second type `T` (e.g. `V & Flavor<T>`).
 *   - If three type arguments are provided, the first type `V` is **unioned**
 *     with type `T`, which is flavored with the third type `F`. This is useful
 *     for creating things like a string literal union with a flavor type. It
 *     is equivalent to `V | Flavored<T, F>`.
 *
 * @template V The type to flavor with the given type `T`.
 * @template T The type to flavor the given type `V` with.
 * @template [F=NEVER] The type that becomes the flavor's value. Defaults to
 * the special `NEVER` type, which is a unique symbol that can be used to
 * create a simulated partial application of type parameters.
 * @category Utility Types
 */
export type Flavored<V, T, F = NEVER> = [F] extends [NEVER] ? V & Flavor<T>
  : V | Flavored<T, F>;

/**
 * Represents an abstract constructor function (i.e. an abstract class) that
 * **cannot** be directly instantiated, but can be extended by other classes.
 *
 * This is a supertype of the {@linkcode Constructor} type, and therefore it
 * typically can be used in place of a constructor type to represent a normal
 * concrete class as well.
 *
 * @template [T=any] The type of the instances created by the constructor.
 * @template {readonly unknown[]} [A=readonly any[]] The type of the arguments
 * passed to the constructor.
 * @category Utility Types
 */
export type AbstractConstructor<
  T = any,
  A extends readonly unknown[] = readonly any[],
> = abstract new (...args: A) => T;

/**
 * Represents a constructor function that can be used to create new instances
 * of a given type {@linkcode T}. Similar to {@linkcode AbstractConstructor},
 * but this represents a concrete class instead of an abstract one.
 *
 * Values of this type are subtypes of {@linkcode AbstractConstructor}.
 *
 * @template [T=any] The type of the instances created by the constructor.
 * @template {readonly unknown[]} [A=readonly any[]] The type of the arguments
 * passed to the constructor.
 * @category Utility Types
 */
export type Constructor<
  T = any,
  A extends readonly unknown[] = readonly any[],
> // @ts-ignore easter egg
 = new (...args: A) => T;

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

/**
 * Returns a union of the keys of an object `T` whose values are functions.
 * This is useful for extracting the keys of a class's methods.
 * @template T The object type to extract keys from.
 * @category Utility Types
 */
export type FunctionKeys<T> = {
  [K in keyof T]: T[K] extends (...args: any) => any ? K : never;
}[keyof T];

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

/**
 * If `A` is `never`, `null`, or `undefined`, returns `B`. Otherwise, as long
 * as `A` is assignable to `B`, returns `A`. Otherwise, returns `never`.
 */
export type Or<A, B> = ([A & {}] extends [never] ? B : A) extends
  infer V extends B ? V : never;

/**
 * Casts a type `T` to a type `U`, but only if `T` is assignable to `U`. If
 * `T` is not assignable to `U`, and if `T & U` results in `never`, then the
 * type `U` is intersected with the type `Omit<T, keyof U>`. This allows for
 * partial type casting, where the two types are merged but defer to `U` where
 * possible. If `T` is not assignable to `U`, and if `T & U` does not result in
 * `never`, then the last resort is to return the intersection of `T` and `U`.
 *
 * @template T The type to cast to the type `U`.
 * @template U The type to cast the type `T` to.
 */
export type As<T, U = unknown> = T extends U ? U extends T ? U : T
  : [T & U] extends [never] ? U & Omit<T, keyof U>
  : T & U;

/**
 * Casts a type `T` to a type `U`, but only if `T` is assignable to `U`. If
 * `Extract<T, U>` results in `never`, then the type `U` is returned as is.
 *
 * @template T The type to cast to the type `U`.
 * @template [U=unknown] The type to cast the type `T` to.
 * @category Utility Types
 */
export type Is<T, U = unknown> = Or<Extract<T, U>, U>;

/**
 * Represents the mildest form of a branded generic string type. This type is
 * used to create string literal unions that accept any string input, but will
 * preserve the literal string union members for autocomplete purposes.
 *
 * For example, using `strings | "foo" | "bar"` for an argument type will allow
 * any string to be passed, but will still suggest `"foo"` or `"bar"` as valid
 * suggestions in an editor that supports TypeScript's language server.
 *
 * > **Note**: the lowercase name was chosen for this type to intentionally
 * > convey that it is capable of being assigned any `string` value. It also
 * > helps distinguish this type from the built-in `string` type, while still
 * > being visually similar.
 *
 * @category Utility Types
 */
export type strings = string & {};

/**
 * Represents the mildest form of a branded generic number type. This type is
 * used to create number literal unions that accept any number input, but will
 * preserve the literal number union members for autocomplete purposes.
 *
 * Similiar to {@linkcode strings}, this type is useful for creating number
 * literal unions that accept any number, but will still suggest the literal
 * number union members for autocomplete purposes.
 *
 * > **Note**: the lowercase name was chosen for this type to intentionally
 * > convey that it is capable of being assigned any `number` value. It also
 * > helps distinguish this type from the built-in `number` type, while still
 * > being visually similar.
 *
 * @category Utility Types
 */
export type numbers = number & {};

/**
 * Represents the mildest form of a branded generic symbol type. This type is
 * used to create symbol literal unions that accept any symbol input, but will
 * preserve the literal symbol union members for autocomplete purposes.
 *
 * Similiar to {@linkcode strings} and {@linkcode numbers}, this type is useful
 * for creating symbol literal unions that accept any symbol, but will still
 * suggest the literal symbol union members for autocomplete purposes.
 *
 * > **Note**: the lowercase name was chosen for this type to intentionally
 * > convey that it is capable of being assigned any `symbol` value. It also
 * > helps distinguish this type from the built-in `symbol` type, while still
 * > being visually similar.
 *
 * @category Utility Types
 */
// We cannot just intersect `symbol` with `{}`, as this will widen the type to
// `symbol`. Instead, we need to create a new type that is a subtype of symbol,
// with a property that is never used.
export type symbols = symbol & { [BRAND]?: never };

/**
 * Union of {@linkcode strings}, {@linkcode numbers}, and {@linkcode symbols},
 * this type can be used as an "anchor" type in a literal union of properties.
 * This will ensure your literal union is not widened to a `string`, `number`,
 * or `symbol` type, but will still accept any of these types as valid inputs.
 *
 * @category Utility Types
 */
export type PropertyKeys = strings | numbers | symbols;

export type { PropertyKeys as properties };

/**
 * Equivalent to the builtin `unknown` type, but supports usage in places where
 * `unknown` would "poison" the type, widening it into `unknown`.
 *
 * For example, if you use `unknown` in any union, it automatically becomes
 * `unknown`. This is a bit of a nuisance with generic type parameters, where
 * sometimes you want to say that you don't know what the type is exactly, but
 * you do know what a couple possibilities are.
 *
 * That's exactly what this type is for. It can be used as a constituent of any
 * union and it will not widen that union to `unknown`. If it's intersected
 * with another type, it will behave just like the real `unknown`, which is to
 * say it will effectively do nothing, and resolve to the other member it is
 * being intersected with.
 */
export type unknowns = {} | null | undefined;

/**
 * Represents a type that is the union of the values of an object `T`.
 */
export type ValueOf<T> = T[keyof T];

/**
 * This is a "safe" version of the `keyof` operator, which will only return
 * keys that are both assignable to `PropertyKey` and are not `never`. This is
 * useful for extracting keys from objects that could potentially be empty, and
 * always ensuring the resulting type is at least a `PropertyKey`.
 *
 * If the {@linkcode Strict} type parameter is set to `false`, the union of
 * keys will be "anchored" with the {@linkcode PropertyKeys} branded type, to
 * allow for literal key unions to be preserved in autocomplete suggestions,
 * which is the default behavior. If `Strict` is set to `true`, the resulting
 * type will not be anchored, and will only include the keys of `T` that are
 * assignable to `PropertyKey`.
 *
 * @template T The object type to extract keys from.
 * @template {boolean} [Strict=false] Whether to return only the keys of `T`
 * that are assignable to `PropertyKey`, or to anchor the resulting union with
 * the `PropertyKeys` branded type.
 * @category Utility Types
 */
export type KeyOf<T, Strict extends boolean = false> =
  | (Strict extends true ? never : PropertyKeys)
  | Is<keyof T, Strict extends true ? PropertyKey : PropertyKeys>;

/**
 * Extracts the parameters of a function or constructor type `T`. If `T` is not
 * a function or constructor, the resulting type will be `never`. This is a
 * safer version of the built-in `Parameters` utility type, which will return
 * `any` if the input type is not a function. This version will instead
 * return `never`, which can help catch errors in type inference.
 *
 * You can also provide a custom `Fallback` type to be used when the input
 * type is not a function or constructor.
 *
 * @template T The function or constructor type to extract parameters from.
 */
// deno-fmt-ignore
export type ParametersOf<T, Fallback extends readonly unknown[] = never> =
  | [T] extends [never] ? Fallback : ParametersOfWorker<
        | T extends (...args: any) => any ? T
        : ValueOf<T> extends infer U
            ? U extends (...args: any) => any ? U : never
          : Fallback,
        Fallback
      > extends infer A extends readonly unknown[] ? A
  : Fallback;

// deno-fmt-ignore
type ParametersOfWorker<T, Fallback extends readonly unknown[]> =
  | T extends (...args: infer A) => any ? Readonly<A> : Fallback;

export type OptionalParametersOf<
  T,
  Fallback extends readonly unknown[] = never,
> = [T] extends [never] ? Fallback
  : ParametersOf<T, Fallback> extends infer A extends readonly unknown[]
    ? OptionalParametersOfWorker<A, Fallback>
  : Fallback;

type OptionalParametersOfWorker<A, Fallback extends readonly unknown[]> =
  A extends readonly [infer F, ...infer R] ? IsEqual<
      Exclude<F, undefined>,
      F,
      OptionalParametersOfWorker<R, Fallback>,
      [F, ...OptionalParametersOfWorker<R, Fallback>]
    >
    : A;

export type IsEqual<A, B, True = true, False = false> =
  (<T>() => T extends A ? 1 : 2) extends <T>() => T extends B ? 1 : 2 ? True
    : False;

/**
 * Adds a `void` type to the given type `T`, to become `T | void`.
 *
 * @category Utility Types
 */
export type Voidable<T> = T | void;

/**
 * The type that can be passed to the {@linkcode MaybeVoidable} type for its
 * second type parameter, `V`. @see {@linkcode MaybeVoidable} for more info
 * on how these types are used.
 *
 * @category Utility Types
 */
export type VoidableArgument = boolean | void;

/**
 * Used to determine the return type of a decorator function. If the argument
 * {@linkcode V} is `true`, then this resolves to `void | T`. If the argument
 * `V` is `false`, it resolves to just `T`. If `V` is `void`, it resolves to
 * just `void`.
 *
 * @template T The type of the return value.
 * @template {VoidableArgument} V Whether the return type should include `void`.
 * @category Utility Types
 */
export type MaybeVoidable<T, V extends VoidableArgument = true> =
  | ([V] extends [true] | [void] ? void : never)
  | ([V] extends [void] ? never : T);

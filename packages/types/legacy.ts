/**
 * @module legacy
 *
 * This module provides generic type definitions for the legacy Stage 2 form
 * of TypeScript Decorators commonly used prior to TypeScript v5.0. It is not
 * recommended to use these types in new code, as they have reached the end of
 * their life cycle and are no longer being actively developed or maintained.
 *
 * Instead, use the new Stage 3 Decorators, which have their signatures
 * defined in the `./signatures.ts` module. These new decorators are more
 * powerful and flexible, much easier to use, and are under active development
 * by both the TypeScript team and the community at large.
 *
 * Unfortunately, the Stage 3 form of the Decorators Proposal does not include
 * support for a ParameterDecorator equivalent. Due to the popularity and the
 * proliferation of ParameterDecorator usage in the wild, it's likely that
 * many projects and libraries will continue to use the legacy Stage 2 form of
 * the decorators for some time to come. As such, these types are provided for
 * the benefit of those who are maintaining or updating existing code.
 *
 * @see https://github.com/tc39/proposal-decorators
 * @see https://decorators.deno.dev for a living document on the Decorators
 * API
 */
export * from "./legacy/accessor.ts";
export * from "./legacy/class.ts";
export * from "./legacy/guards.ts";
export * from "./legacy/method.ts";
export * from "./legacy/parameter.ts";
export * from "./legacy/property.ts";
export * from "./legacy/utilities.ts";

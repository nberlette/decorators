import { is } from "jsr:@type/is@0.1.0";

export * from "jsr:@type/is@0.1.0";

/**
 * Asserts that a given {@link condition} is met, and throws an error if not.
 *
 * You can provide an optional {@link message}, either as a string or an Error
 * object, to provide more context about the failure.
 *
 * Additionally, a {@link stackCrawlMark} function can be provided to control
 * generated stack trace on the error that is thrown. This must be a reference
 * to a function, which will be used as the starting point for the stack trace.
 *
 * Any stack frames above this function will be omitted from the final stack.
 * If no {@link stackCrawlMark} is provided, the `assert` function will be used
 * as the starting point for the stack, excluding the call to `assert` itself.
 *
 * @param condition The condition to assert.
 * @param [message] An optional message or error object to provide more context
 * about the failure and the expected condition.
 * @param [stackCrawlMark] An optional function reference to use as the starting
 * point for the stack trace. Any stack frames above this function are omitted.
 * If not provided, the `assert` function itself is used as the starting point.
 * @throws If the condition is not met, an error is thrown with the provided
 * @example
 * ```ts
 * import { assert } from "@type/assert";
 *
 * const foo: unknown = 123;
 *
 * assert(typeof foo === "string", "Expected a string!");
 * // => Uncaught TypeError: Expected a string!
 * ```
 * @example
 * ```ts
 * import { assert } from "@type/assert";
 * import { is } from "@type/is";
 *
 * // This example demonstrates the stackCrawlMark parameter.
 * function myFunction(value: unknown, useInnerHelper?: boolean) {
 *    const helper = (value: unknown) => {
 *      assert(is.string(value), "Expected a string!", helper);
 *    };
 *    const helper2 = (value: unknown) => {
 *      helper(value);
 *    };
 *    const fn = useInnerHelper ? helper2 : helper;
 *    fn(value);
 * }
 *
 * // This omits all internal function calls beyond 'myFunction':
 * myFunction(123, false);
 * // Uncaught TypeError: Expected a string!
 * //     at myFunction (file:///path/to/file.ts:4:9)
 *
 * // This only omits the call to 'helper' from the stack:
 * myFunction(123, true);
 * // Uncaught TypeError: Expected a string!
 * //     at helper2 (file:///path/to/file.ts:8:9)
 * //     at myFunction (file:///path/to/file.ts:10:9)
 * ```
 * @category Assertions
 */
export function assert(
  condition: unknown,
  message?: string | Error,
  // deno-lint-ignore no-explicit-any
  stackCrawlMark?: (...args: any[]) => unknown,
  ErrorType: typeof Error = TypeError,
): asserts condition {
  if (!condition) {
    const error = is.error(message) ? message : new ErrorType(
      message ?? "Assertion failed. No additional context provided.",
    );
    Error.captureStackTrace?.(error, stackCrawlMark ?? assert);
    error.stack?.slice();
    throw error;
  }
}

# Contributing Guide

Thank you for your interest in contributing to the @decorators monorepo. Your
contributions make this project better for everyone!

## How to Contribute

### Reporting Issues

- Check the [issue tracker](https://github.com/nberlette/decorators/issues) to
  see if the issue already exists.
- When reporting a new issue, provide a descriptive title and clear steps to
  reproduce the problem.

### Proposing Changes

1. [Open an Issue] to discuss your proposed changes.
   - This helps us understand the context and purpose of your changes.
   - If your change is a bug fix, please include the issue number in your
     description (e.g., `Fixes #123`).

2. Fork the repository and clone it to your local machine.

```bash
gh repo fork --clone nberlette/decorators
```

3. Create a feature branch for your specific change. Keep it focused.

```bash
git checkout -b feature/your-feature
```

4. Commit your changes following the [conventional commit format].

````bash
 git add . # or `git add <specific-file>`
 git commit -m "feat: your-feature"

```bash
 git add . # or `git add <specific-file>`
 git commit -m "Add feature: your-feature"
````

5. Push your branch and open a pull request.

```bash
git push origin feature/your-feature
```

6. In your pull request, provide a clear description of the changes and why they
   are necessary. Include any relevant issue numbers and links to related
   discussions or documentation.

7. Request a review from the maintainers.

[conventional commit format]: https://www.conventionalcommits.org/en/v1.0.0/#specification "Conventional Commits Specification"

Please ensure:

- Each pull request addresses a single issue.
- Your changes include appropriate tests and documentation if applicable.
- Your code adheres to the repository’s [style guidelines].
- Your commit messages follow the [conventional commit format].
- Your code is well-documented and easy to understand.
- Each new feature is accompanied by a corresponding test.
  - A good rule of thumb is: 1 new `.ts` file = 1 new `.test.ts` file.
- You have run the tests and they all pass.

## Style Guidelines

We follow the same code style as the [Deno project](https://deno.land), and use
the [Deno CLI](https://docs.deno.com/go/cli) for linting, formatting, testing,
benchmarking, documentation, and more.

### Code Style and Formatting

- Lines are limited to 80 characters.
- Use 2 spaces for indentation, no tabs.
- Use double quotes for strings.
- Use semicolons at the end of statements.
- Arrow functions should have parentheses around the parameters.
- Always include explicit return types and parameter types on public functions
  and methods. Use `as const` on literals when possible.
- Avoid using `any` type. Use specific types, generics, or `unknown` instead.

### Other Guidelines and Best Practices

- Use `const` and `let` instead of `var`.

### Documentation

We use the `deno doc` tool for generating documentation, as does [JSR], our main
distribution channel for packages in the `@decorators/*` namespace.

Deno's documentation tool requires JSDoc comments and type annotations to be on
all public APIs. Some of the rules we follow are:

- Wrap JSDoc comments to 80 characters as well.
- Use `@param` and `@returns` in JSDoc comments.
- Use `@example` in JSDoc comments for examples.
- Use `@see` in JSDoc comments for references.
- Use `@category` and `@tags` in JSDoc comments for categorization.
- Each module file must begin with a `@module` doc comment.
- Internal modules and features can be commented with `@internal`.

### Code of Conduct

All contributors are expected to follow the guidelines outlined in our
[Code of Conduct](./CODE_OF_CONDUCT.md). Please report any unacceptable
behavior.

### Testing

Before submitting your pull request, make sure all tests pass:

```bash
npm install
npm run test
```

## License

By contributing to this project, you agree that your contributions will be
licensed under the [MIT License](https://nick.mit-license.org/2024).

---

We appreciate your support and look forward to your contributions!

<div align="center">

**[MIT]** © **[Nicholas Berlette]**. All rights reserved.

<small>[GitHub] · [Issues] · [JSR]</small>

</div>

[MIT]: https://nick.mit-license.org "MIT © 2024+ Nicholas Berlette. All rights reserved."
[Nicholas Berlette]: https://github.com/nberlette "Nicholas Berlette on GitHub"
[GitHub]: https://github.com/nberlette/decorators#readme "Check out all the '@decorators/*' packages over at the GitHub monorepo!"
[Issues]: https://github.com/nberlette/decorators/issues "GitHub Issue Tracker for '@decorators/*' packages"
[Open an Issue]: https://github.com/nberlette/decorators/issues/new "Open an Issue on nberlette/decorators"
[JSR]: https://jsr.io/@decorators "View @decorators/* packages on JSR"
[Code of Conduct]: ./CODE_OF_CONDUCT.md "Code of Conduct"

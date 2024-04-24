# [![@][@]decorators][docs]

Monorepo for packages published under the [`@decorators/*`][JSR] scope on [JSR].

---

## Packages


#### [`@decorators/bind`][@decorators/bind]

> Bind methods, getters, and setters to the appropriate context object, with
> support for static members and inheritance.

```ts
import { bind } from "@decorators/bind";

class Foo {
  @bind bar(): Foo {
    return this;
  }

  @bind static self(): typeof Foo {
    return this;
  }
}
const { self } = Foo, { bar } = new Foo();

console.log(self === Foo); // true
console.log(bar() instanceof Foo); // true
```

---

<div align="center">

##### **[MIT]** © **[Nicholas Berlette]**. <small>All rights reserved.</small>

###### [GitHub] · [Issues] · [Docs]

</div>

[@decorators/bind]: https://github.com/nberlette/decorators/tree/main/packages/bind#readme "Check out '@decorators/bind' and more over at the GitHub monorepo!"
[GitHub]: https://github.com/nberlette/decorators/tree/main/packages/bind#readme "Check out all the '@decorators/*' packages over at the GitHub monorepo!"
[MIT]: https://nick.mit-license.org "MIT © 2024+ Nicholas Berlette. All rights reserved."
[Nicholas Berlette]: https://github.com/nberlette "Nicholas Berlette on GitHub"
[Issues]: https://github.com/nberlette/decorators/issues "GitHub Issue Tracker for '@decorators/*' packages"
[Open an Issue]: https://github.com/nberlette/decorators/issues/new?assignees=nberlette&labels=bugs&title=%5Bbind%5D+ "Found a bug? Let's squash it!"
[Docs]: https://n.berlette.com/decorators "View @decorators API docs"
[JSR]: https://jsr.io/@decorators "View @decorators/* packages on JSR"
[Stage 3 Decorators]: https://github.com/tc39/proposal-decorators "TC39 Proposal: Decorators"
[@]: https://api.iconify.design/streamline:mail-sign-at-email-at-sign-read-address.svg?width=2.5rem&height=1.4rem&color=%23fb0

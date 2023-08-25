# Utility Docs

The utilities in this library support all environments.

## Circular Imports

This package contains many reusable and fundamental building blocks. Many of which are required internally; i.e., in the composition of others herein. In fact, internal reliance on these utilities is so prevalent that the structure of this library is one that necessitates circular imports. There are some important circular import considerations, however.

-   [16.3.6.1 Cyclic dependencies in CommonJS](https://o5p.me/tp2pCK)
-   [16.3.6.2 Cyclic dependencies in ECMAScript 6](https://o5p.me/EK1tYf)

The the most important thing to keep in mind, is this:

> As a general rule, keep in mind that with cyclic dependencies, you can’t access imports in the body of the module. That is inherent to the phenomenon and doesn’t change with ECMAScript 6 modules.

To clarify further, modules which have internal dependencies must leverage those internal dependencies _within_ their exports — not to _produce_ an export; i.e., not by leveraging internal dependencies in their module body, which is where problems arise.

Use in a module body is a problem because modules can’t resolve circular imports if one module body cyclically depends on another module body. Circular imports are just fine otherwise, and well-supported by CommonJS and ES6+.

## Utility Docs Index

-   [./resources/classes/obj-mc.md](./resources/classes/obj-mc.md)

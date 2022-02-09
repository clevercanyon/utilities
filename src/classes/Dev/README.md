## Terminology

## Namespace Scope

Many of our packages are scoped by PHP Scoper. In the process of scoping, a prefix is added before
everything else — even before a package's Namespace Crux; e.g.,
`Xae3c7c368fe2e3c\Clever_Canyon\Utilities`. A Namespace Scope is the prefix that is used for
scoping; i.e., `Xae3c7c368fe2e3c`.

## Namespace Crux

Every package must have a two-level namespace that prefixes everything else contained in the
package; e.g., `Clever_Canyon\Utilities` is a Namespace Crux. A package may contain many other
files, each living under sub-namespace names, but the Namespace Crux is the required two-level
prefix at the top, following a possible Namespace Scope; i.e., the Namespace Crux in
`Xae3c7c368fe2e3c\Clever_Canyon\Utilities\A6t\Base` is
`Clever_Canyon\Utilities`.

## FQN Crux

In PHP, every interface, class, trait, constant, method, function (outside of a class), includes a
FQN which begins with a namespace, sometimes followed by `::` or `->`, and optionally ends with a
member name. A FQN Crux consists of everything in the FQN except for the Namespace Scope; i.e., the
FQN Crux in
`Xae3c7c368fe2e3c\Clever_Canyon\Utilities\A6t\Base` is
`Clever_Canyon\Utilities\A6t\Base`.

### Package

A Package is anything that lives in a GitHub repository under a Namespace Crux. A Package must have
a
`composer.json` file and a name in the `composer.json` file. A Package can also be referred to as a
Project. The difference is that a Package can be contained by a Project. It is the smallest unit of
library code within a Project; i.e., Projects are typically comprised of many Packages.

### Project

A Project is a Package or collection of Packages. It is the same as an App, only it represents a
larger body of work that includes everything an App does, plus development files and workflows;
i.e., all of the underlying source code and tooling needed for development of the App.

### App

An App is a Package or collection of Packages that is released in the form of a working application
that serves a purpose. Typically, an App will consist of a primary Package that leverages a
collection of other Packages. These all ship together. The accompanying Packages live inside of
a `/vendor` directory, which are scoped by PHP Scoper and autoloaded by Composer.

### Themes & Plugins

These are examples of different types of Apps.

## Brand & Project Slugs

The proper way to handle project slugs is to always, always, always begin with a two-level namespace
crux and a Composer package basename. When these are converted to slugs they must match up with each
other:

- `My_Brand\My_Project`        → `my-brand-my-project`
- `my-org/my-brand-my-project` → `my-brand-my-project`

Then, when a project creates its own settings, slugs, etc., a project slug prefix must be used as a
delimiter. A project slug prefix uses the special `-x-`
delimiter. e.g., `my-brand-my-project-x-foo` ... `foo` being something project-specific.

Note that a brand prefix doesn't use an `-x-` delimiter. It simply uses a `-`
hyphen. It is not necessary to use an `-x-` delimiter, because a brand name won't have sub-brand
names, it won't have options, or other brand-specific settings. Whereas projects under that brand
may indeed have options, slugs, or other project-specific settings.

### Validations

A project must always have a two-level namespace crux starting with its brand name. When converted
to a slug, it must match the project's slug, which is derived as follows:

The `Project` class derives a project's brand n7m, brand slug, and namespace crux from
its `composer.json` file. When the namespace crux is converted to a slug it must match the project
slug.

The `Project` class derives a project's slug from it's Composer package basename. It's OK if a
project's Composer package basename doesn't include the brand's slug prefix. However, the `Project`
class will detect this, and instead it will derive the project's slug from the full package name,
which includes the org-level slug.

### Validation Examples

`clevercanyon/utilities` has a `composer.json` file that says its brand n7m is `c10n`, which is used
to derive the brand's slug: `clevercanyon`. This project has a package basename that's not prefixed
with the `clevercanyon`
brand slug. Therefore, the full package name is used instead, producing `clevercanyon-utilities`.
It's namespace crux must therefore be `Clever_Canyon\Utilities`. When converted to a slug it
matches `clevercanyon-utilities`.

`clevercanyon/wpgroove-framework` has a `composer.json` file that says its brand n7m is `w6e`, which
is used to derive the brand's slug: `wpgroove`. This project has a package basename that's properly
prefixed with the `wpgroove`
brand slug. Therefore, `wpgroove-framework`
is used as the project slug. It's namespace crux must therefore be `WP_Groove\Framework`. When the
namespace crux is converted to a slug it matches `wpgroove-framework`.

`clevercanyon/wpgroove-skeleton-plugin` has a `composer.json` file that says its brand n7m is `w6e`,
which is used to derive the brand's slug: `wpgroove`. This project has a package basename that's
properly prefixed with the `wpgroove`
brand slug. Therefore, `wpgroove-skeleton-plugin`
is used as the project slug. It's namespace crux must therefore be `WP_Groove\Skeleton_Plugin`. When
the namespace crux is converted to a slug it matches `wpgroove-skeleton-plugin`.

### Rationale

The reason for `-x-` is because alternatives like `--` are often not allowed by many 3rd-party
services (our partners) for one reason or another. Also, it further complicates slug
validation/generation spanning multiple levels. By using `-x-`, even multilevel slugs validate like
any other; e.g., `my-brand-my-project-x-foo-x-bar`.

### Important Rule

Because `-x-` is used as a delimiter, there is a very important rule. None of our brands or products
can have a name, namespace, slug, or var that starts with `[Xx][_\-]`, ends with `[_\-][Xx]`, or
contains `[_\-][Xx][_\-]`.

So long as that rule is followed, this will scale just fine. Here are some examples of how this can
scale to multiple levels without creating the potential for a conflict in future iterations.

#### Level One

- `My_Brand\My_Project`
- `my-brand-my-project`
- `my-brand-my-project-x-foo`

#### Level Two

- `My_Brand\My_Project_Pro`
- `my-brand-my-project-pro`
- `my-brand-my-project-pro-x-foo`

#### Level Three

- `My_Brand\My_Project_Pro_Addon`
- `my-brand-my-project-pro-addon`
- `my-brand-my-project-pro-addon-x-foo`

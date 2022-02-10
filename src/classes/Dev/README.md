## Organization Terminology

### Organization

An Organization is a Brand, or a group of Brands. Under those Brands there are people, software,
tools, services, websites, and more. More generally, an Organization is a body of people with a
particular purpose, especially a business, society, association, etc.

The term 'Organization' is also sometimes used to describe a taxonomy, which typically lives at the
top of a hierarchy and encapsulates Brands and Products. For example, every piece of software that
we create lives under a GitHub Organization with the name `clevercanyon`. Currently, we use the same
Organization for all software, which again, is `clevercanyon` on GitHub. We may expand to other
GitHub Organizations in the future.

From more of a business perspective, our top-level parent Organization is CLEVER CANYON LLC.

### Brands

Within an Organization there are Brands, and under those Brands there are Products. A Brand can also
be an Organization itself; e.g., CLEVER CANYON is both a Brand and an Organization.

Some of our Products may decide to rebrand; e.g., move to a different Brand, or to a new
Sub-Organization under CLEVER CANYON; or whatever makes sense.

### Products

Every Brand has at least one Product, and sometimes many Products. A Product is a broad way of
describing something that is produced by an Organization under a given Brand. Every Product is
created under a specific Brand, and every Brand is under a specific Organization. Here's a quick
look at this structure.

- CLEVER CANYON LLC
	- Brand
		- Product
		- Product
		- ...
	- Brand
		- Product
		- Product
		- ...
	- ...
	- Sub-Organization
		- Brand
			- Product
			- Product
			- ...
		- Brand
			- Product
			- Product
			- ...
		- ...

## Project Terminology

### Project

A Project is a Package or a collection of Packages that already is, or will become, a Library for
others to consume, or an App of some kind, for others to use. To say something is a Project is
almost the same as calling it a Package, Library, or an App. The difference is that a Project often
represents a larger body of work. A Project includes everything a Package, Library, or App does ...
plus development files, tests, and workflows; i.e., all of the underlying source code and tooling
needed for development. That's the important distinction, and it's why most of our documentation
refers to various software as a Project; i.e., the term Project encompasses more.

### Package

A Package is anything that lives in a GitHub repository. A Package is often a dependency for other
Packages. It's the smallest atomic grouping of code within a Project, Library, or App.

A Package must have a
`composer.json` file and a Package `name`; i.e., the JSON `name` property must be populated in
`composer.json`. If a Package contains PHP code, it must also have a Namespace Crux, and optionally
a Namespace Scope if it's to be scoped by PHP Scoper.

Typically, a Package will depend on other Packages, which can get pretty complex in some cases.
Satisfying Package dependencies is exactly what Composer is designed for. Every Package by CLEVER
CANYON uses Composer.

Typically, a Package will consist of code that leverages a collection of other Packages. These all
ship together as a set of Composer dependencies defined in `composer.json`. When compiled, the
accompanying Packages live inside of a
`/vendor`
directory, which are all scoped by PHP Scoper and autoloaded by Composer.

### Library

A Library is just a different way to describe a Package, or collection of Packages. It's
specifically designed to be consumed by other Packages. The difference between an App and a Library
is that an App is shipped to a consumer vs. a Library, which is typically shipped to other
developers.

### App

An App is just a different way to describe a Package, or collection of Packages. It's a piece of
software that's released in the form of a working application that serves a purpose. The difference
between an App and a Library is that an App is shipped to a consumer vs. a Library, which is
typically shipped to other developers.

### Web-Based Software, WP Themes, and WP Plugins

These are examples of different types of Apps. There are lot of terms to throw around. The ones
listed above are the most important ones at CLEVER CANYON.

---

## Namespace Terminology

### Namespace Scope

Many of our Projects are scoped by PHP Scoper. In the process of scoping a prefix is added before
everything else; e.g.,
`Xae3c7c368fe2e3c\Clever_Canyon\Utilities`. A Namespace Scope is the prefix that is used for
scoping; i.e., `Xae3c7c368fe2e3c`.

A Namespace Scope must start with an `X` (caSe-sensitive), be exactly 16 bytes in length, and
consist of `X` + 15 hexits; {@see U\Crypto::x_sha()}.

The {@see U\Dev\Project} class generates this automatically. It's a special hash of the Project's
Namespace Crux; which makes it relatively short, consistent, and unique, for each Project. It's also
constructed in a way that allows a Project to change GitHub organizations and continue to keep the
same Namespace Scope.

{@see U\Pkg::NAMESPACE_SCOPE_REGEXP} for further details.

### Brand Namespace

Every Brand gets a Brand Namespace for PHP code; e.g., `Clever_Canyon`. When a Project forms a
Namespace Crux, it must be under a specific Brand, and it must always begin with a valid Brand
Namespace.

To clarify further. The first part of a Namespace Crux (i.e., the Brand Namespace), must match the
`namespace`
for that Brand in our {@see U\Brand::
BY_N7M} list. Also, please remember that new brands must be added to the list before compiling a
Project so that validations will succeed and not block your work.

A Brand Namespace is allowed to start with `[Xx][_\-]`, end with `[_\-][Xx]`, or contain `[_\-][Xx]
[_\-]
`. It is not subject to the same limitation as Project Slugs. A PHP namespace uses
`\\` delimitation, so there's no need for `-x-` or the like; {@see U\Pkg::BRAND_NAMESPACE_REGEXP}
for further details.

### Namespace Crux

Every Project must have a two-level namespace that prefixes all sub-namespaces in PHP code for that
Project. That two-level namespace is referred to as a Namespace Crux; e.g.,
`Clever_Canyon\Utilities`.

To further clarify. A Project may contain many other files, each living under sub-namespace names. A
Namespace Crux is the required two-level prefix at the top (preceded only by a possible Namespace
Scope). For example, the Namespace Crux in
`Xae3c7c368fe2e3c\Clever_Canyon\Utilities\A6t\Base` is
`Clever_Canyon\Utilities`.

A Namespace Crux is allowed to start with `[Xx][_\-]`, end with `[_\-][Xx]`, or contain `[_\-][Xx]
[_\-]
`. It is not subject to the same limitation as Project Slugs. A PHP namespace uses
`\\` delimitation, so there's no need for `-x-` or the like; {@see U\Pkg::
NAMESPACE_CRUX_REGEXP} for further details. That said, the second level of a Namespace Crux must
match the Unbranded Project Slug, so the
`-x-` limitation still applies to some extent, for the second level ... more on this below.

A Namespace Crux must begin with a Brand Namespace that is valid; i.e., exists in our {@see
U\Brand::BY_N7M} list, and it must match what `composer.json` states the Brand should be.
Additionally, the second portion of a Namespace Crux, when forced to all lowercase and when
underscores `_` are converted to hyphens `-`; it must match the Unbranded Project Slug, exactly.

### FQN Crux

FQN = Fully-Qualified Name

In PHP, every interface, class, trait, constant, method, and namespaced function, includes a FQN
which begins with a namespace, sometimes followed by `::` or `->`, and optionally ends with a member
name, which is part of its definition in code.

A FQN Crux consists of everything in the FQN except for the Namespace Scope. For example, the FQN
Crux in
`Xae3c7c368fe2e3c\Clever_Canyon\Utilities\A6t\Base` is
`Clever_Canyon\Utilities\A6t\Base`.

A FQN Crux is allowed to start with `[Xx][_\-]`, end with `[_\-][Xx]`, or contain `[_\-][Xx]
[_\-]
`. It is not subject to the same limitation as Project Slugs. A PHP namespace uses
`\\` delimitation, so there's no need for `-x-` or the like; {@see U\Pkg::
FQN_CRUX_REGEXP} for further details.

---

## Brand & Project Slugs

The proper way to handle Brand and Project slugs is to always, always, always be consistent, and to
be very particular about the right things, not the wrong things.

In marketing and sales copy, it's important to fine-tune wording. That's the right thing to be
particular about. Take the time that's needed to get it right — as long as it takes.

However, that's not the case in code. Please don't nitpick over the way certain words appear in
code. If your code is adhering to a set of standards and best practices, you're in good shape — vs.
needing to make changes later because of a conflict that you didn't foresee. That's why we have
coding standards and working groups.

Start by identifying the Brand your Project falls under, and use the appropriate Brand Slug and
Brand Slug Prefix when deciding what to name your GitHub repository.

### Brand Slug & Prefix

<small>e.g., GitHub Organization: `clevercanyon/`</small>  
e.g., Brand Slug: `my-brand`  
e.g., Brand Slug Prefix: `my-brand-`

- A Brand Slug must not start with `[Xx][_\-]`, end with `[_\-][Xx]`, or contain `[_\-][Xx][_\-]
  `.
- A Brand Slug Prefix is simply a Brand Slug followed by a single `-`.

{@see U\Str::is_brand_slug()} and {@see U\Str::
is_brand_slug_prefix()} for further details. There are byte-length and character requirements.

When a Brand Slug is used for a GitHub organization name, or in Composer and NPM Package names;
e.g.,
`clevercanyon.github.io`, `clevercanyon/`, `clevercanyon/my-brand-...`, `@clevercanyon/`,
`@clevercanyon/my-brand-...` or in the generation of Brand and Project Slugs; it must match the
Brand Slug in our {@see U\Brand::
BY_N7M} list. Also, please remember that new brands must be added to the list before compiling a
Project.

### Project Slug

- aka: Repo Name
- aka: Project Basename

A Project's `composer.json->name` will be used to derive the Project Slug, which is used in code,
and also converted {@see to_lede_var()} in some cases.

When a Project creates its own settings, slugs, cache keys, etc., a Project Slug Prefix must be
used. It has a special `-x-`
delimiter; e.g., `my-brand-my-project-x-foo` ... with `foo` being something Project-specific.

<small>e.g., GitHub Organization: `clevercanyon/`</small>  
e.g., Project Slug: `my-brand-my-project`  
e.g., Project Slug Prefix: `my-brand-my-project-x-`

- A Project Slug must always start with a Brand Slug Prefix.
	- One exception is the case of an org-level Project; e.g., `clevercanyon/utilities` is not under
	  a separate Brand, it's under the Organization's Brand; i.e., `clevercanyon/`. So the Brand
	  Slug Prefix can be left off. To clarify further. When the {@see U\Dev\Project} class derives
	  the Project Slug from a `composer.json->name`, if the basename doesn't include a valid Brand
	  Slug Prefix, it will fall back on using the full `composer.json->name`; e.g,
	  `clevercanyon/utilities` converted to a Project Slug is `clevercanyon-utilities`.

- A Project Slug must not start with `[Xx][_\-]`, end with `[_\-][Xx]`, or contain `[_\-][Xx][_\-]`.

The Project Slug is a Lede Slug; {@see U\Str::is_lede_slug()} and {@see U\Str::
is_lede_slug_prefix()} for further details. There are byte-length and character requirements.

Note that a Brand Slug Prefix doesn't use an `-x-` delimiter. It simply uses a `-`
hyphen. It is not necessary to use an `-x-` delimiter for a Brand Slug Prefix, because a Brand won't
have sub-brands, it won't have options, or other brand-specific settings. Whereas Projects under
that Brand may indeed have options, slugs, or other Project-specific settings. The special `-x-`
delimiter is designed to scale out to many, many Projects and protects against naming conflicts
potentially arising later.

### Unbranded Project Slug

This is simply a Project Slug with the Brand Slug Prefix removed. It is common for an Unbranded
Project Slug to be used in URLs; e.g., `https://my-brand.com/products/unbranded-slug`. The domain
name is already in front of the Unbranded Project Slug.

### Rationale Behind `-x-`

The reason for `-x-` is because alternatives like `--` are often not allowed by many 3rd-party
services (our partners) for one reason or another. Also, it further complicates slug
validation/generation spanning multiple levels. By using `-x-`, even multilevel slugs validate like
any other; e.g., `my-brand-my-project-x-foo-x-bar`.

#### A Few Examples

##### Level One

- `My_Brand\My_Project`
- `my-brand-my-project`
- `my-brand-my-project-x-foo`

##### Level Two

- `My_Brand\My_Project_Pro`
- `my-brand-my-project-pro`
- `my-brand-my-project-pro-x-foo`

##### Level Three

- `My_Brand\My_Project_Pro_Addon`
- `my-brand-my-project-pro-addon`
- `my-brand-my-project-pro-addon-x-foo`

### Namespace Crux

In PHP code, choose a Namespace Crux.

e.g., `<?php namespace ...;`  
e.g., Namespace Crux: `My_Brand\My_Project`

Every Project must have a two-level namespace that prefixes all sub-namespaces in PHP code for that
Project. That two-level namespace is referred to as a Namespace Crux; e.g.,
`Clever_Canyon\Utilities`.

To further clarify. A Project may contain many other files, each living under sub-namespace names. A
Namespace Crux is the required two-level prefix at the top (preceded only by a possible Namespace
Scope). For example, the Namespace Crux in
`Xae3c7c368fe2e3c\Clever_Canyon\Utilities\A6t\Base` is
`Clever_Canyon\Utilities`.

A Namespace Crux is allowed to start with `[Xx][_\-]`, end with `[_\-][Xx]`, or contain `[_\-][Xx]
[_\-]
`. It is not subject to the same limitation as Project Slugs. A PHP namespace uses
`\\` delimitation, so there's no need for `-x-` or the like; {@see U\Pkg::
NAMESPACE_CRUX_REGEXP} for further details. That said, the second level of a Namespace Crux must
match the Unbranded Project Slug, so the
`-x-` limitation still applies to some extent, for the second level ... more on this below.

A Namespace Crux must begin with a Brand Namespace that is valid; i.e., exists in our {@see
U\Brand::BY_N7M} list, and it must match what `composer.json` states the Brand should be.
Additionally, the second portion of a Namespace Crux, when forced to all lowercase and when
underscores `_` are converted to hyphens `-`; it must match the Unbranded Project Slug, exactly.

The validation just described considers two important things:

The first level of a Namespace Crux (i.e., the Brand Namespace) must be valid and match
what `composer. json`
states the Brand should be. However, it doesn't need to match the Brand Slug. Often, a Brand Slug
will use abbreviations or remove hyphens, whereas a Brand Namespace will choose to follow PSR-4
guidelines; e.g.,
`clevercanyon` Brand Slug vs. `Clever_Canyon` Brand Namespace. It's OK for these to be different, so
long as they are both valid, based on all of the above.

`Clever_Canyon\Utilities` = `Clever_Canyon` = {@see U\Brand::BY_N7M} = ok!  
`Clever_Canyon\Utilities` = `Clever_Canyon` = what `composer.json` says it should be = ok!

The second level of a Namespace Crux must match the Unbranded Project Slug so there are not
deviations that result in naming conflicts. It wouldn't make sense to have a Namespace
Crux `Clever_Canyon\PHP_Utilities` and a Project Slug of `clevercanyon-utilities`. The second level
of a Namespace Crux should be an exact match to the Unbranded Project Slug. This is to avoid PHP
namespace collisions inadvertently.

An exact match is tested by forcing the second level of the Namespace Crux to all lowercase and
converting underscores `_` to hyphens `-`. Then comparing this to the Unbranded Project Slug.

`Clever_Canyon/Utilities` = `utilities`  
`clevercanyon-utilities`  = `utilities` (exact match).

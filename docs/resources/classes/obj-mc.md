# `classes/obj-mc.ts`

MC is short for merge-change. This library was originally inspired by [merge-change](https://www.npmjs.com/package/merge-change) on NPM, but has since evolved into a much more robust set of utilities that fixes many bugs and is now fully integrated with our utilities package.

The Object MC utilities are structured as class members in `./src/resources/classes/obj-mc.ts`. However, they are accessed conveniently using the `$obj` utilities export, which exposes MC tools by way of: `$obj.mergeDeep()`, `$obj.mergeClonesDeep()`, `$obj.patchDeep()`, `$obj.patchClonesDeep()`, `$obj.updateDeep()`, and `$obj.updateClonesDeep()`.

Our version of MC is a simple library for the deep merge of objects, also for immutable updates. The most popular utility in this library is `$obj.mergeDeep()`, which works for arrays and plain objects. Other object types are transferred in by reference. However, there are variants that handle things differently. Also, you can use declarative operations to do some very interesting things like `$set`, `$unset`, `$leave`, `$push`, `$pull`, `$concat`, `$default`, and more — inspired by MongoDB.

All utilities are 100% safe to use on objects containing circular references.

## API

### Merge Deep

Lossless merge with **deep cloning of arrays and plain objects**, and without changing the `target` object. Great for creating or extending objects deeply. New instances are created deeply with all `...merges` being deep-cloned prior to merging into a `target` object derivation; i.e., the `target` object is not mutated by reference.

-   **Note:** This produces a deep clone of arrays and plain objects only. The `$obj.mergeDeep()` and `$obj.patchDeep()` utilities are typically the most popular merge types, as they each produce a lossless merge. There is no data lost because object types that are not arrays or plain objects are simply transferred in by reference.
-   **Note:** This type of merge makes no guarantees regarding the immutability of any `...merges`, and in fact, if declarative operations are used in any of the `...merges`, it is possible that mutations will occur within them. For example, if anything that’s not an array or plain object is simply transferred into `target` by reference and then declaratively operated on.
    -   _Declarative operations are performed immediately after each merge occurs._

```js
$obj.mergeDeep(target, ...merges);
```

Example:

```js
import { $obj } from '@clevercanyon/utilities';

let target = {
    test: {
        string: '1',
        integer: 1,
        boolean: true,
        url: new URL('https://target.tld/'),
    },
};
let merge = {
    test: {
        integer: 2,
        date: new Date('2023-01-01'),
        url: new URL('https://merge.tld/'),
        $unset: ['string'], // $unset is a declarative operation.
    },
};
const result = $obj.mergeDeep(target, merge);

console.log(result); // A newly merged deep object clone.
console.log(result !== target); // true
console.log(result !== merge); // true

// These were simply transferred in by reference.
console.log(result.test.url === merge.test.url); // true
console.log(result.test.date === merge.test.date); // true
```

Result:

```text
{
    test: {
        integer: 2,
        boolean: true,
        url: URL {href: 'https://merge.tld/', ...},
        date: Date {...} 2023-01-01T00:00:00.000Z,
    },
}
```

### Merge Clones Deep

Lossy merge with **deep cloning of _all_ compatible object types**, and without changing the `target` object. New instances are created deeply with all `...merges` being deep-cloned prior to merging into a `target` object derivation; i.e., the `target` object is not mutated by reference. This kind of merge is lossy because deep-cloning is sometimes lossy.

-   **Note:** Underneath, this uses `$obj.cloneDeep()` on object types that are not arrays or plain objects. Instead of simply being transferred in by reference like `$obj.mergeDeep()` does, they are instead cloned deeply with `$obj.cloneDeep()`, and _then_ transferred in by reference to the deep clone.
-   **Note:** This type of merge guarantees immutability of all compatible object types in any `...merges`, because there is deep cloning of _all_ compatible object types. Thus, immutability is guaranteed even when there are declarative operations.
    -   _Declarative operations are performed immediately after each merge occurs._

```js
$obj.mergeClonesDeep(target, ...merges);
```

Example:

```js
import { $obj } from '@clevercanyon/utilities';

let target = {
    test: {
        string: '1',
        integer: 1,
        boolean: true,
        url: new URL('https://target.tld/'),
    },
};
let merge = {
    test: {
        integer: 2,
        date: new Date('2023-01-01'),
        url: new URL('https://merge.tld/'),
        $unset: ['string'], // $unset is a declarative operation.
    },
};
const result = $obj.mergeClonesDeep(target, merge);

console.log(result); // A newly merged deep object clone.
console.log(result !== target); // true
console.log(result !== merge); // true

// These were cloned, not simply transferred in by reference.
console.log(result.test.url !== merge.test.url); // true
console.log(result.test.date !== merge.test.date); // true
```

Result:

```text
{
    test: {
        integer: 2,
        boolean: true,
        url: URL {href: 'https://merge.tld/', ...},
        date: Date {...} 2023-01-01T00:00:00.000Z,
    },
}
```

### Patch Deep

Works exactly the same as `$obj.mergeDeep()`, except it mutates the `target` object by reference.

Lossless merge with **deep cloning of arrays and plain objects**, mutating the `target` object by reference. Great for creating or extending objects deeply. New instances are created deeply with all `...patches` being deep-cloned prior to merging into a `target` object; i.e., the `target` object is mutated by reference.

-   **Note:** This produces a deep clone of arrays and plain objects only. The `$obj.mergeDeep()` and `$obj.patchDeep()` utilities are typically the most popular merge types, as they each produce a lossless merge. There is no data lost because object types that are not arrays or plain objects are simply transferred in by reference.
-   **Note:** This type of merge makes no guarantees regarding the immutability of any `...patches`, and in fact, if declarative operations are used in any of the `...patches`, it is possible that mutations will occur within them. For example, if anything that’s not an array or plain object is simply transferred into `target` by reference and then declaratively operated on.
    -   _Declarative operations are performed immediately after each merge occurs._

```js
$obj.patchDeep(target, ...patches);
```

Example:

```js
import { $obj } from '@clevercanyon/utilities';

let target = {
    test: {
        string: '1',
        integer: 1,
        boolean: true,
        url: new URL('https://target.tld/'),
    },
};
let patch = {
    test: {
        integer: 2,
        date: new Date('2023-01-01'),
        url: new URL('https://patch.tld/'),
        $unset: ['string'], // $unset is a declarative operation.
    },
};
const result = $obj.patchDeep(target, patch);
// `$obj.patchDeep(target, patch)` will suffice;
// i.e., because the `target` object is patched by reference.

// Patched target.
console.log(result);

// Result is not the patch.
console.log(result !== patch); // true

// Rather, target was patched by reference.
console.log(result === target); // true

// These were simply transferred in by reference.
console.log(result.test.url === patch.test.url); // true
console.log(result.test.date === patch.test.date); // true
```

Result:

```text
{
    test: {
        integer: 2,
        boolean: true,
        url: URL {href: 'https://patch.tld/', ...},
        date: Date {...} 2023-01-01T00:00:00.000Z,
    },
}
```

### Patch Clones Deep

Works exactly the same as `$obj.mergeClonesDeep()`, except it mutates the `target` object by reference.

Lossy merge with **deep cloning of _all_ compatible object types**, mutating the `target` object by reference. New instances are created deeply with all `...patches` being deep-cloned prior to merging into a `target` object; i.e., the `target` object is mutated by reference. This kind of merge is lossy because deep-cloning is sometimes lossy.

-   **Note:** Underneath, this uses `$obj.cloneDeep()` on object types that are not arrays or plain objects. Instead of simply being transferred in by reference like `$obj.patchDeep()` does, they are instead cloned deeply with `$obj.cloneDeep()`, and _then_ transferred in by reference to the deep clone.
-   **Note:** This type of merge guarantees immutability of all compatible object types in any `...patches`, because there is deep cloning of _all_ compatible object types. Thus, immutability is guaranteed even when there are declarative operations.
    -   _Declarative operations are performed immediately after each merge occurs._

```js
$obj.patchClonesDeep(target, ...patches);
```

Example:

```js
import { $obj } from '@clevercanyon/utilities';

let target = {
    test: {
        string: '1',
        integer: 1,
        boolean: true,
        url: new URL('https://target.tld/'),
    },
};
let patch = {
    test: {
        integer: 2,
        date: new Date('2023-01-01'),
        url: new URL('https://patch.tld/'),
        $unset: ['string'], // $unset is a declarative operation.
    },
};
const result = $obj.patchClonesDeep(target, patch);
// `$obj.patchClonesDeep(target, patch)` will suffice;
// i.e., because the `target` object is patched by reference.

// Patched target.
console.log(result);

// Result is not the patch.
console.log(result !== patch); // true

// Rather, target was patched by reference.
console.log(result === target); // true

// These were cloned, not simply transferred in by reference.
console.log(result.test.url !== merge.test.url); // true
console.log(result.test.date !== merge.test.date); // true
```

Result:

```text
{
    test: {
        integer: 2,
        boolean: true,
        url: URL {href: 'https://patch.tld/', ...},
        date: Date {...} 2023-01-01T00:00:00.000Z,
    },
}
```

### Update Deep

Lossy **immutable merge** with **deep cloning of _all_ compatible object types required to maintain immutability**, and without changing the `target` object, because `target` and all `...updates` are treated as immutable objects. Great for updating state. New instances are created deeply with all `...updates` being deep-cloned prior to merging into a `target` object derivation, but **only when there are differences** introduced by the `...updates`.

The `target` object is not mutated by reference. Rather, if there are differences, a deep clone of the `target` with all `...updates` having been merged in, is returned. Otherwise, the `target` object is returned unchanged, by reference; i.e., when none of the `...updates` introduce changes. Thus, the return value can be tested to easily determine if changes were introduced.

-   **Note:** Underneath, this uses `$is.deepEqual()` to check for differences, and `$obj.cloneDeep()` is used on object types that are not arrays or plain objects. This kind of merge is lossy because deep-cloning is necessary to ensure immutability, and deep-cloning is sometimes lossy, depending on the object types being deep-cloned.
    -   **Note:** `$is.deepEqual()` uses `Object.keys()` and therefore does not consider symbol keys.
-   **Note:** This type of merge guarantees immutability of all compatible object types in any `...updates`, because there is deep cloning of _all_ compatible object types. Thus, immutability is guaranteed even when there are declarative operations.
    -   _Declarative operations are performed immediately after each merge occurs._

_This utility is currently identical to `$obj.updateClonesDeep()`. However, in general, if deep-cloning is mission-critical, the `$obj.updateClonesDeep()` variant is recommened, as it may evolve in the future to operate more favorably toward deep-cloning vs. this `$obj.updateDeep()` utility, which uses deep-cloning only when it must in order to maintain immutability._

```js
$obj.updateDeep(target, ...updates);
```

Example 1: (**changes do occur in this case**):

```js
import { $obj } from '@clevercanyon/utilities';

let target = {
    test: {
        string: '1',
        integer: 1,
        boolean: true,
        url: new URL('https://target.tld/'),
    },
};
let update = {
    test: {
        integer: 2,
        date: new Date('2023-01-01'),
        url: new URL('https://update.tld/'),
        $unset: ['string'], // $unset is a declarative operation.
    },
};
const result = $obj.updateDeep(target, update);

// Potentially updated target.
console.log(result); // A new object in this case.

// Result !== target; i.e., because there were changes.
// This is how you determine if changes occurred following an update.
console.log(result !== target); // true

// Result is also not the update, just to be clear.
console.log(result !== update); // true

// These were simply transferred in by reference.
console.log(result.test.url === update.test.url); // true
console.log(result.test.date === update.test.date); // true
```

Result:

```text
{
    test: {
        integer: 2,
        boolean: true,
        url: URL {href: 'https://update.tld/', ...},
        date: Date {...} 2023-01-01T00:00:00.000Z,
    },
}
```

Example 2: (**no changes occur in this case**):

```js
import { $obj } from '@clevercanyon/utilities';

let target = {
    test: {
        string: '1',
        integer: 1,
        boolean: true,
        url: new URL('https://target.tld/'),
    },
};
let update = {
    test: {
        string: '1',
        integer: 1,
        boolean: true,
    },
};
const result = $obj.updateDeep(target, update);

// Potentially updated target.
console.log(result); // The original target in this case.

// Result === target; i.e., because there were no changes.
// This is how you determine if changes occurred following an update.
console.log(result === target); // true
```

Result:

```text
{
    test: {
        string: '1',
        integer: 1,
        boolean: true,
        url: URL {href: 'https://target.tld/', ...},
    },
}
```

### Update Clones Deep

Lossy **immutable merge** with **deep cloning of _all_ compatible object types**, and without changing the `target` object, because `target` and all `...updates` are treated as immutable objects. Great for updating state. New instances are created deeply with all `...updates` being deep-cloned prior to merging into a `target` object derivation, but **only when there are differences** introduced by the `...updates`.

The `target` object is not mutated by reference. Rather, if there are differences, a deep clone of the `target` with all `...updates` having been merged in, is returned. Otherwise, the `target` object is returned unchanged, by reference; i.e., when none of the `...updates` introduce changes. Thus, the return value can be tested to easily determine if changes were introduced.

-   **Note:** Underneath, this uses `$is.deepEqual()` to check for differences, and `$obj.cloneDeep()` is used on object types that are not arrays or plain objects. This kind of merge is lossy because deep-cloning is necessary to ensure immutability, and deep-cloning is sometimes lossy, depending on the object types handled by `$obj.cloneDeep()`.
    -   **Note:** `$is.deepEqual()` uses `Object.keys()` and therefore does not consider symbol keys.
-   **Note:** This type of merge guarantees immutability of all compatible object types in any `...updates`, because there is deep cloning of _all_ compatible object types. Thus, immutability is guaranteed even when there are declarative operations.
    -   _Declarative operations are performed immediately after each merge occurs._

_This utility is currently identical to `$obj.updateDeep()`. However, in general, if deep-cloning is mission-critical, this variant is recommened, as it may evolve in the future to operate more favorably toward deep-cloning vs. `$obj.updateDeep()`, which uses deep-cloning only when it must in order to maintain immutability._

```js
$obj.updateClonesDeep(target, ...updates);
```

Example 1: (**changes do occur in this case**):

```js
import { $obj } from '@clevercanyon/utilities';

let target = {
    test: {
        string: '1',
        integer: 1,
        boolean: true,
        url: new URL('https://target.tld/'),
    },
};
let update = {
    test: {
        integer: 2,
        date: new Date('2023-01-01'),
        url: new URL('https://update.tld/'),
        $unset: ['string'], // $unset is a declarative operation.
    },
};
const result = $obj.updateClonesDeep(target, update);

// Potentially updated target.
console.log(result); // A new object in this case.

// Result !== target; i.e., because there were changes.
// This is how you determine if changes occurred following an update.
console.log(result !== target); // true

// Result is also not the update, just to be clear.
console.log(result !== update); // true

// These were simply transferred in by reference.
console.log(result.test.url === update.test.url); // true
console.log(result.test.date === update.test.date); // true
```

Result:

```text
{
    test: {
        integer: 2,
        boolean: true,
        url: URL {href: 'https://update.tld/', ...},
        date: Date {...} 2023-01-01T00:00:00.000Z,
    },
}
```

Example 2: (**no changes occur in this case**):

```js
import { $obj } from '@clevercanyon/utilities';

let target = {
    test: {
        string: '1',
        integer: 1,
        boolean: true,
        url: new URL('https://target.tld/'),
    },
};
let update = {
    test: {
        string: '1',
        integer: 1,
        boolean: true,
    },
};
const result = $obj.updateClonesDeep(target, update);

// Potentially updated target.
console.log(result); // The original target in this case.

// Result === target; i.e., because there were no changes.
// This is how you determine if changes occurred following an update.
console.log(result === target); // true
```

Result:

```text
{
    test: {
        string: '1',
        integer: 1,
        boolean: true,
        url: URL {href: 'https://target.tld/', ...},
    },
}
```

## Declarative Operations

Supported in all merge methods. When merging, patching, or updating objects, you can perform declarative operations at the same time. Declarative operations can be a massive time-saver. The syntax is similar to, and inspired by, MongoDB.

### Note:

-   The use of `$` as a prefix implies the standard `.` object path separator.
    -   e.g., `$set: { 'a.b.c[0]': 'value' }` to set `{ a: { b: { c: ['value'] } } }`.
-   The use of `$ꓺ` implies the use of `ꓺ` (i.e., [`\uA4FA`](https://graphemica.com/%EA%93%BA#code)) as an object path separator.
    -   e.g., `$ꓺset: { 'aꓺbꓺc[0]': 'value' }` to set `{ a: { b: { c: ['value'] } } }`.

### `$set`, `$ꓺset`

To set (or replace) a property by name or object path.

```js
const result = $obj.mergeDeep(
    {
        a: {
            one: 1,
            two: 2,
        },
    },
    {
        $set: {
            a: {
                three: 3,
            },
            'a.two': 20, // Keys can be an object path.
        },
    },
);
console.log(result);
```

Result:

```json
{
    "a": {
        "three": 3,
        "two": 20
    }
}
```

### `$unset`, `$ꓺunset`

-   aka: `$omit`, `$ꓺomit`.

To unset properties by name or object path.

```js
const result = $obj.mergeDeep(
    {
        a: {
            one: 1,
            two: 2,
        },
    },
    {
        $unset: ['a.two'],
    },
);
console.log(result);
```

Result:

```json
{
    "a": {
        "one": 1
    }
}
```

To unset all keys use `*`.

-   Note: `*` only unsets array keys and/or end-own enumerable string keys.

```js
const result = $obj.mergeDeep(
    {
        a: {
            one: 1,
            two: 2,
        },
    },
    {
        $unset: ['a.*'],
    },
);
console.log(result);
```

Result:

```json
{
    "a": {}
}
```

### `$leave`, `$ꓺleave`

-   aka: `$pick`, `$ꓺpick`.

To leave properties by name or object path. Implies all other properties should be unset.

-   Note: only array keys and/or end-own enumerable string keys will be unset by this operation.

```js
const result = $obj.mergeDeep(
    {
        a: {
            one: 1,
            two: 2,
            tree: 3,
        },
    },
    {
        a: {
            $leave: ['two'],
        },
    },
);
console.log(result);
```

Result:

```json
{
    "a": {
        "two": 2
    }
}
```

### `$push`, `$ꓺpush`

To push an item **_as one value_** _(so please be careful)_ onto an array.

-   To push multiple values, please see: `$concat`, `$ꓺconcat`.

```js
const result = $obj.mergeDeep(
    // First object
    {
        prop1: ['a', 'b'],
        prop2: ['a', 'b'],
        prop3: ['a', 'b'],
    },
    // Merge
    {
        $push: {
            prop1: ['c', 'd'],
            prop2: { x: 'c' },
            prop3: 'c',
        },
    },
);
console.log(result);
```

Result:

```json
{
    "prop1": ["a", "b", ["c", "d"]],
    "prop2": ["a", "b", { "x": "c" }],
    "prop3": ["a", "b", "c"]
}
```

### `$pull`, `$ꓺpull`

To pull (i.e., remove) values from an array.

```js
const result = $obj.mergeDeep(
    // First object
    {
        prop1: ['a', 'b', 'c', 'x'],
        prop2: ['a', 'b', 'c', 'x', 'y', 'z'],
        prop3: [1, 2, 3, 100, 200],
    },
    // Merge
    {
        $pull: {
            prop1: 'x',
            prop2: ['x', 'y', 'z'],
            prop3: [100, 200],
        },
    },
);
console.log(result);
```

Result:

```json
{
    "prop1": ["a", "b", "c"],
    "prop2": ["a", "b", "c"],
    "prop3": [1, 2, 3]
}
```

### `$concat`, `$ꓺconcat`

To concatenate arrays (i.e., to push multiple items).

-   To push a single item, please see: `$push`, `$ꓺpush`.

```js
const result = $obj.mergeDeep(
    // First object
    {
        prop1: ['a', 'b'],
        prop2: ['a', 'b'],
    },
    // Merge
    {
        $concat: {
            prop1: ['c', 'd'],
            prop2: { x: 'c' },
        },
    },
);
console.log(result);
```

Result:

```json
{
    "prop1": ["a", "b", "c", "d"],
    "prop2": ["a", "b", { "x": "c" }]
}
```

### `$default`, `$ꓺdefault`

-   aka: `$defaults`, `$ꓺdefaults`.

To set default values (i.e., set only if `undefined`).

```js
const result = $obj.mergeDeep(
    // First object
    {
        prop1: ['a', 'b', 'c'],
        prop2: ['a', 'b', 'c'],
        prop3: {
            a: 'a',
            b: 'b',
            c: {
                d: 'd',
            },
        },
    },
    // Merge
    {
        $default: {
            'prop1': ['default'],
            'prop2': ['default'],
            'prop3.a': 'default',
            'prop3.b': 'default',
            'prop3.c.d': 'default',
            'prop3.c.e': 'default',
            'prop3.f': 'default',
            'prop3.g': ['default'],
        },
    },
);
console.log(result);
```

Result:

```json
{
   "prop1": ["a", "b", "c"],
   "prop2": ["a", "b", "c"],
   "prop3": {
     "a": "a",
     "b": "b",
     "c": {
       "d": "d",
       "e": "default",
     },
   "f": "default",
   "g": ["default"],
}
```

### `$keySortOrder`, `$ꓺkeySortOrder`

-   aka: `$propSortOrder`, `$ꓺpropSortOrder`.

To sort object properties by key, using a given order.

```js
const result = $obj.mergeDeep(
    // First object
    {
        prop3: {
            c: {
                d: 'd',
            },
            b: 'b',
            e: null,
        },
        prop00: '00',
        prop1: ['a', 'b', 'c'],
        a: 'a',
        prop2: ['a', 'b', 'c'],
    },
    // Merge
    {
        prop4: '4',
        $keySortOrder: [
            'a', //
            'prop0',
            'prop1',
            'prop2',
            'prop3.b',
            'prop3.c.d',
            'prop3.e',
            'prop4',
        ],
        prop0: '0',
        prop00: '00', // Not in sort order given, so comes after all others.
    },
);
console.log(result);
```

Result:

```json
{
    "a": "a",
    "prop0": "0",
    "prop1": ["a", "b", "c"],
    "prop2": ["a", "b", "c"],
    "prop3": {
        "b": "b",
        "c": {
            "d": "d"
        },
        "e": null
    },
    "prop4": "4",
    "prop00": "00"
}
```

## Custom Merges

First, create a new custom instance of the Object MC class.

```js
const mc = $obj.mcCustom(); // New custom instance.
```

You can declare a new merge handler for custom types and/or override default logic. This API returns the previous merge handler, if one exists, so that it can be restored. However, restoration is not necessary when using a custom instance.

```js
mc.addMerge(tagA, tagB, callback);
```

-   `tagA, tagB`: Object tags of the `a` and `b` values; e.g., `Number`, `String`, `Boolean`, `Object`, `Array`, `Date`, `RegExp`, `Function`, `Undefined`, `Null`, `Symbol`, `Set`, `Map`, or any other object tag is permissible.
-   `callback`: Merge handler: `(a, b, kind, circular): unknown`
    -   `a`: First value for merge. Of type `tagA` passed to `mc.addMerge()`.
    -   `b`: Second value for merge. Of type `tagB` passed to `mc.addMerge()`.
    -   `kind`: e.g., `mergeDeep`, `mergeClonesDeep`, `patchDeep`, `patchClonesDeep`, `updateDeep`, `updateClonesDeep`.
    -   `circular`: Two-dimensional map used to log and recursively handle circular references gracefully.
        -   If `this[kind]()` is called from within, `circular` must be passed to `this[kind]()` as last arg.

For example, if you need to handle arrays differently, you can declare a callback that merges `Array` with `Array`. The example below contains the default callback, which you can adapt to handle arrays in the way you prefer.

```js
const previous = mc.addMerge('Array', 'Array', function (a, b, kind, circular) {
    if ([this.kinds.PATCH_DEEP, this.kinds.PATCH_CLONES_DEEP].includes(kind)) {
        circular.get(a)?.set(b, a);

        a.splice(0, a.length); // Deletes `a` keys.

        for (let key = 0; key < b.length; key++) {
            a[key] = this[kind](undefined, b[key], circular);
        }
        return a; // Returns `a`, mutated by reference.
        //
    } else if ([this.kinds.UPDATE_DEEP, this.kinds.UPDATE_CLONES_DEEP].includes(kind) && $isꓺdeepEqual(a, b)) {
        circular.get(a)?.set(b, a);
        return a; // Returns `a` when there are no differences.
        //
    } else {
        const bClone: unknown[] = [];
        circular.get(a)?.set(b, bClone);

        for (let key = 0; key < b.length; key++) {
            bClone[key] = this[kind](undefined, b[key], circular);
        }
        return bClone; // Returns `b` clone, which replaces `a`.
    }
});

// Restores previous handler.
if (previous) mc.addMerge('Array', 'Array', previous);
```

## Custom Declarative Operations

First, create a new custom instance of the Object MC class.

```js
const mc = $obj.mcCustom(); // New custom instance.
```

You can declare a new handler for a declarative operation and/or override default logic. This API returns the previous operation handler, if one exists, so that it can be restored. However, restoration is not necessary when using a custom instance.

```js
mc.addOperation(name, callback);
```

-   `name`: Operation name; e.g., `$concat`, `$unset`, `$pull`, etc. ... or a new one.
-   `callback`: `(target, params, separator?, calledAs?): boolean`.
    -   `target`: Value the operation should act on.
    -   `params`: Operation params; e.g., what to `$concat`.
        -   Array or object keys should be treated as object paths.
    -   `separator`: Object path separator. Default should be `.`; i.e., a single dot/period.
        -   If you want to support the `ꓺ` (i.e., [`\uA4FA`](https://graphemica.com/%EA%93%BA#code)) separator, then add a variant with a `$ꓺ` name prefix, and where the `separator` defaults to `ꓺ` in that variant. See `calledAs` for further details regarding the creation of variants.
    -   `calledAs`: Operation name used to call this handler. Default should be `name`.
        -   The reason for this to exist is that it can be changed if you add aliases and/or slight variants that use a different separator, for example, even though still leveraging the same callback, just with a different `calledAs` value.

For example, here's an already-defined operation handler that could be customized further.

```js
const previous = mc.addOperation('$concat', (target, params, separator = '.', calledAs = '$concat') => {
    if (!$isꓺobject(target)) {
        throw Error('yd3hj28h'); // Invalid ' + calledAs + '. Requires object target.
    }
    if (!$isꓺobject(params) || $isꓺarray(params)) {
        throw Error('nMr2JuWf'); // Invalid ' + calledAs + ' params. Expecting non-array object.
    }
    for (const [path, value] of Object.entries(params)) {
        const array = $obpꓺget(target, path, [], separator);

        if (!$isꓺarray(array)) {
            throw Error('PwukxeW3'); // Invalid ' + calledAs + '. Cannot concat onto non-array value.
        }
        $obpꓺset(target, path, array.concat(value), separator);
    }
    return Object.keys(params).length > 0;
});

// Restores previous handler.
if (previous) mc.addOperation('$concat', previous);
```

/**
 * Defines missing `entries()` on FormData.
 */
interface FormData {
    entries(): IterableIterator<[key: string, value: string | Blob]>;
}

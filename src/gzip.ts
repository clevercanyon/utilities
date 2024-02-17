/**
 * Gzip utilities.
 */

import '#@initialize.ts';

import { $str } from '#index.ts';

/**
 * Gzip-encodes a string into a compressed byte array.
 *
 * @param   str String to gzip.
 *
 * @returns     Byte array promise; {@see Uint8Array}.
 */
export const encode = async (str: string): Promise<Uint8Array> => {
    const chunks = [],
        readableStream = new Blob([str]).stream(),
        compressedStream = readableStream.pipeThrough(new CompressionStream('gzip'));

    for await (const chunk of compressedStream as unknown as Iterable<Uint8Array>) {
        chunks.push(chunk); // Chunks of byte arrays.
    }
    return combineByteArrays(chunks);
};

/**
 * Decodes a compressed byte array.
 *
 * @param   bytes Compressed byte array.
 *
 * @returns       Decode string promise.
 */
export const decode = async (bytes: Uint8Array): Promise<string> => {
    const chunks = [],
        readableStream = new Blob([bytes]).stream(),
        decompressedStream = readableStream.pipeThrough(new DecompressionStream('gzip'));

    for await (const chunk of decompressedStream as unknown as Iterable<Uint8Array>) {
        chunks.push(chunk); // Chunks of byte arrays.
    }
    return $str.textDecode(await combineByteArrays(chunks));
};

// ---
// Misc utilities.

/**
 * Combines multiple byte arrays.
 *
 * @param   uint8Arrays Input byte arrays.
 *
 * @returns             Byte array promise; {@see Uint8Array}.
 */
const combineByteArrays = async (uint8Arrays: Readonly<Uint8Array>[]): Promise<Uint8Array> => {
    const blob = new Blob(uint8Arrays),
        arrayBuffer = await blob.arrayBuffer();

    return new Uint8Array(arrayBuffer);
};

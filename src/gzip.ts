/**
 * Gzip utilities.
 */

import '#@initialize.ts';

import { $bytes, $str } from '#index.ts';

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
    return $bytes.combine(chunks);
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
    return $str.textDecode(await $bytes.combine(chunks));
};

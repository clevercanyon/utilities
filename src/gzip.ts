/**
 * Gzip utilities.
 */

import '#@initialize.ts';

import { $bytes, $obj, $str } from '#index.ts';

/**
 * Defines types.
 */
export type EncodeOptions = { deflate?: boolean };
export type DecodeOptions = { deflate?: boolean };

/**
 * Gzip-encodes a string into a compressed byte array.
 *
 * @param   str     String to gzip.
 * @param   options All optional; {@see EncodeOptions}.
 *
 * @returns         Byte array promise; {@see Uint8Array}.
 */
export const encode = async (str: string, options?: EncodeOptions): Promise<Uint8Array> => {
    const opts = $obj.defaults({}, options || {}, { deflate: false }) as Required<EncodeOptions>,
        chunks = [], // Initializes chunks.
        readableStream = new Blob([str]).stream(),
        compressedStream = readableStream.pipeThrough(new CompressionStream(opts.deflate ? 'deflate' : 'gzip'));

    for await (const chunk of compressedStream as unknown as AsyncIterable<Uint8Array>) {
        chunks.push(chunk); // Chunks of byte arrays.
    }
    return $bytes.combine(chunks);
};

/**
 * Decodes a compressed byte array.
 *
 * @param   bytes   Compressed byte array.
 * @param   options All optional; {@see DecodeOptions}.
 *
 * @returns         Decode string promise.
 */
export const decode = async (bytes: Uint8Array, options?: DecodeOptions): Promise<string> => {
    const opts = $obj.defaults({}, options || {}, { deflate: false }) as Required<DecodeOptions>,
        chunks = [], // Initializes chunks.
        readableStream = new Blob([bytes]).stream(),
        decompressedStream = readableStream.pipeThrough(new DecompressionStream(opts.deflate ? 'deflate' : 'gzip'));

    for await (const chunk of decompressedStream as unknown as AsyncIterable<Uint8Array>) {
        chunks.push(chunk); // Chunks of byte arrays.
    }
    return $str.textDecode(await $bytes.combine(chunks));
};

/**
 * Test suite.
 */

import { $is, $str } from '#index.ts';
import { describe, expect, test } from 'vitest';

describe('$str', async () => {
    test('.byteLength()', async () => {
        // <https://o5p.me/r833HP>
        expect($str.byteLength('abcdefghijklmnopqrstuvwxyzꓺ0123456789')).toBe(39);
        expect($str.byteLength(new String('abcdefghijklmnopqrstuvwxyzꓺ0123456789').valueOf())).toBe(39);
    });
    test('.charLength()', async () => {
        // <https://o5p.me/r833HP>
        expect($str.charLength('abcdefghijklmnopqrstuvwxyzꓺ0123456789')).toBe(37);
        expect($str.charLength(new String('abcdefghijklmnopqrstuvwxyzꓺ0123456789').valueOf())).toBe(37);
    });
    test('.toBytes()', async () => {
        expect($str.toBytes('')).toStrictEqual(new Uint8Array());
        expect($str.toBytes('abc')).toStrictEqual(new Uint8Array([97, 98, 99]));
    });
    test('.toChars()', async () => {
        expect($str.toChars('')).toStrictEqual([]);
        expect($str.toChars('abc')).toStrictEqual(['a', 'b', 'c']);
    });
    test('.fromBytes(.toBytes())', async () => {
        expect($str.fromBytes($str.toBytes('abcdefghijklmnopqrstuvwxyzꓺ0123456789'))).toBe('abcdefghijklmnopqrstuvwxyzꓺ0123456789');
        expect($str.fromBytes($str.toBytes('àèìòùÀÈÌÒÙáéíóúýÁÉÍÓÚÝâêîôûÂÊÎÔÛãñõÃÑÕäëïöüÿÄËÏÖÜŸçÇßØøÅåÆæœ'))).toBe('àèìòùÀÈÌÒÙáéíóúýÁÉÍÓÚÝâêîôûÂÊÎÔÛãñõÃÑÕäëïöüÿÄËÏÖÜŸçÇßØøÅåÆæœ');
    });
    test('.fromChars(.toChars())', async () => {
        expect($str.fromChars($str.toChars('abcdefghijklmnopqrstuvwxyzꓺ0123456789'))).toBe('abcdefghijklmnopqrstuvwxyzꓺ0123456789');
        expect($str.fromChars($str.toChars('àèìòùÀÈÌÒÙáéíóúýÁÉÍÓÚÝâêîôûÂÊÎÔÛãñõÃÑÕäëïöüÿÄËÏÖÜŸçÇßØøÅåÆæœ'))).toBe('àèìòùÀÈÌÒÙáéíóúýÁÉÍÓÚÝâêîôûÂÊÎÔÛãñõÃÑÕäëïöüÿÄËÏÖÜŸçÇßØøÅåÆæœ');
    });
    test('.numeronym()', async () => {
        expect($str.numeronym('x')).toBe('x1x');
        expect($str.numeronym('Hop.gdn')).toBe('h5n');
        expect($str.numeronym('My Brand')).toBe('m5d');
        expect($str.numeronym('Clever Canyon')).toBe('c10n');
        expect($str.numeronym('heļlṏ, ꓺ ... 🦊 wɵrḻɖ!')).toBe('h7l');
        expect($str.numeronym('àèìòùÀÈÌÒÙáéíóúýÁÉÍÓÚÝâêîôûÂÊÎÔÛãñõÃÑÕäëïöüÿÄËÏÖÜŸçÇßØøÅåÆæœ')).toBe('a52a');
    });
    test('.deburr()', async () => {
        expect($str.deburr('heļlṏ, ꓺ ... 🦊 wɵrḻɖ!')).toBe('hello, ꓺ ... 🦊 wɵrlɖ!');
        expect($str.deburr('àèìòùÀÈÌÒÙáéíóúýÁÉÍÓÚÝâêîôûÂÊÎÔÛãñõÃÑÕäëïöüÿÄËÏÖÜŸçÇßØøÅåÆæœ')).toBe('aeiouAEIOUaeiouyAEIOUYaeiouAEIOUanoANOaeiouyAEIOUYcCßØøAaÆæœ');
    });
    test('.asciiOnly()', async () => {
        expect($str.asciiOnly('heļlṏ, ꓺ ... 🦊 wɵrḻɖ!')).toBe('hello, .. ...  wrl!');
        expect($str.asciiOnly('àèìòùÀÈÌÒÙáéíóúýÁÉÍÓÚÝâêîôûÂÊÎÔÛãñõÃÑÕäëïöüÿÄËÏÖÜŸçÇßØøÅåÆæœ')).toBe('aeiouAEIOUaeiouyAEIOUYaeiouAEIOUanoANOaeiouyAEIOUYcCAa');
    });
    test('.obpPartSafe()', async () => {
        expect($str.obpPartSafe('[heļlṏ, ꓺ ... 🦊 wɵrḻɖ!]')).toBe('⦍heļlṏ, ᱹᱹ ᱹᱹᱹ 🦊 wɵrḻɖ!⦎');
        expect($str.obpPartSafe('àèìòùÀÈÌÒÙáéíóúýÁÉÍÓÚÝâêîôûÂÊÎÔÛãñõÃÑÕäëïöüÿÄËÏÖÜŸçÇßØøÅåÆæœ')).toBe('àèìòùÀÈÌÒÙáéíóúýÁÉÍÓÚÝâêîôûÂÊÎÔÛãñõÃÑÕäëïöüÿÄËÏÖÜŸçÇßØøÅåÆæœ');
    });
    test('.trim()', async () => {
        expect($str.trim('  [heļlṏ, ꓺ🦊!] ')).toBe('[heļlṏ, ꓺ🦊!]');
        expect($str.trim(' àèìò çÇßØøÅåÆæœ  ')).toBe('àèìò çÇßØøÅåÆæœ');

        expect($str.trim('  [heļlṏ, ꓺ🦊!] ', '[!]')).toBe('heļlṏ, ꓺ🦊');
        expect($str.trim('  [heļlṏ, ꓺ🦊!] ', '[!ꓺ]🦊,')).toBe('heļlṏ');
    });
    test('.lTrim()', async () => {
        expect($str.lTrim('  [heļlṏ, ꓺ🦊!] ')).toBe('[heļlṏ, ꓺ🦊!] ');
        expect($str.lTrim(' àèìò çÇßØøÅåÆæœ  ')).toBe('àèìò çÇßØøÅåÆæœ  ');

        expect($str.lTrim('  [heļlṏ, ꓺ🦊!] ', '[!]')).toBe('heļlṏ, ꓺ🦊!] ');
        expect($str.lTrim('  [heļlṏ, ꓺ🦊!] ', '[!ꓺ]🦊,')).toBe('heļlṏ, ꓺ🦊!] ');
    });
    test('.rTrim()', async () => {
        expect($str.rTrim('  [heļlṏ, ꓺ🦊!] ')).toBe('  [heļlṏ, ꓺ🦊!]');
        expect($str.rTrim(' àèìò çÇßØøÅåÆæœ  ')).toBe(' àèìò çÇßØøÅåÆæœ');

        expect($str.rTrim('  [heļlṏ, ꓺ🦊!] ', '[!]')).toBe('  [heļlṏ, ꓺ🦊');
        expect($str.rTrim('  [heļlṏ, ꓺ🦊!] ', '[!ꓺ]🦊,')).toBe('  [heļlṏ');
    });
    test('.clip()', async () => {
        expect($str.byteLength('[…]')).toBe(5);
        expect($str.charLength('[…]')).toBe(3);

        expect($str.clip('🦊øÅåabcdefg', { maxBytes: 9 })).toBe('🦊[…]');
        expect($str.clip('abcdefg🦊øÅå', { maxBytes: 10 })).toBe('abcde[…]');

        expect($str.byteLength($str.clip('🦊øÅåabcdefg', { maxBytes: 9 }))).toBe(9);
        expect($str.byteLength($str.clip('abcdefg🦊øÅå', { maxBytes: 10 }))).toBe(10);

        expect($str.clip('🦊øÅåabcdefg', { maxChars: 10 })).toBe('🦊øÅåabc[…]');
        expect($str.clip('abcdefg🦊øÅå', { maxChars: 10 })).toBe('abcdefg[…]');

        expect($str.charLength($str.clip('🦊øÅåabcdefg', { maxChars: 10 }))).toBe(10);
        expect($str.charLength($str.clip('abcdefg🦊øÅå', { maxChars: 10 }))).toBe(10);
    });
    test('.midClip()', async () => {
        expect($str.byteLength('[…]')).toBe(5);
        expect($str.charLength('[…]')).toBe(3);

        expect($str.byteLength($str.midClip('', { maxBytes: 9 }))).toBe(0);
        expect($str.byteLength($str.midClip('', { maxBytes: 10 }))).toBe(0);

        expect($str.byteLength($str.midClip('x', { maxBytes: 9 }))).toBe(1);
        expect($str.byteLength($str.midClip('x', { maxBytes: 10 }))).toBe(1);

        expect($str.byteLength($str.midClip('abcdefghi', { maxBytes: 9 }))).toBe(9);
        expect($str.byteLength($str.midClip('abcdefghij', { maxBytes: 10 }))).toBe(10);

        expect($str.byteLength($str.midClip('abcdefghij', { maxBytes: 9 }))).toBe(9);
        expect($str.byteLength($str.midClip('abcdefghijk', { maxBytes: 10 }))).toBe(10);

        expect($str.byteLength($str.midClip('abcdefghijklmnopqrstuvwxyz', { maxBytes: 9 }))).toBe(9);
        expect($str.byteLength($str.midClip('abcdefghijklmnopqrstuvwxyz', { maxBytes: 10 }))).toBe(10);

        expect($str.charLength($str.midClip('abcdefghijklmnopqrstuvwxyz', { maxChars: 9 }))).toBe(9);
        expect($str.charLength($str.midClip('abcdefghijklmnopqrstuvwxyz', { maxChars: 10 }))).toBe(10);

        expect($str.midClip('abcdefghij', { maxBytes: 9 })).toBe('ab[…]ij');
        expect($str.midClip('abcdefghijk', { maxBytes: 10 })).toBe('abc[…]jk');

        expect($str.midClip('abcdefghijklmnopqrstuvwxyz', { maxBytes: 9 })).toBe('ab[…]yz');
        expect($str.midClip('abcdefghijklmnopqrstuvwxyz', { maxBytes: 10 })).toBe('abc[…]yz');

        expect($str.midClip('abcdefghijklmnopqrstuvwxyz', { maxChars: 9 })).toBe('abc[…]xyz');
        expect($str.midClip('abcdefghijklmnopqrstuvwxyz', { maxChars: 10 })).toBe('abcd[…]xyz');

        expect($str.midClip('🦊øÅåabcdefg', { maxChars: 10 })).toBe('🦊øÅå[…]efg');
        expect($str.midClip('abcdefg🦊øÅå', { maxChars: 10 })).toBe('abcd[…]øÅå');

        expect($str.charLength($str.midClip('🦊øÅåabcdefg', { maxChars: 10 }))).toBe(10);
        expect($str.charLength($str.midClip('abcdefg🦊øÅå', { maxChars: 10 }))).toBe(10);
    });
    test('.split()', async () => {
        expect('abc'.split('')).toStrictEqual(['a', 'b', 'c']);
        expect(() => $str.split('abc', '')).toThrowError('dN4Gt9m7');

        expect('a.b.c'.split('.')).toStrictEqual(['a', 'b', 'c']);
        expect($str.split('a.b.c', '.')).toStrictEqual(['a', 'b', 'c']);

        expect('a.b.c'.split('..')).toStrictEqual(['a.b.c']);
        expect($str.split('a.b.c', '..')).toStrictEqual(['a.b.c']);

        expect('a.b.c'.split('.', 2)).toStrictEqual(['a', 'b']);
        expect($str.split('a.b.c', '.', 2)).toStrictEqual(['a', 'b.c']);

        expect('a.b.c'.split(/[.]/u, 2)).toStrictEqual(['a', 'b']);
        expect($str.split('a.b.c', /[.]/u, 2)).toStrictEqual(['a', 'b.c']);

        expect('a...b...c'.split(/[.]+/u, 2)).toStrictEqual(['a', 'b']);
        expect($str.split('a...b...c', /[.]+/u, 2)).toStrictEqual(['a', 'b...c']);

        expect('a...b...c....d.e.f.g.'.split(/[.]+/u, 3)).toStrictEqual(['a', 'b', 'c']);
        expect($str.split('a...b...c....d.e.f.g.', /[.]+/u, 3)).toStrictEqual(['a', 'b', 'c....d.e.f.g.']);

        expect('a.b.c.d.e.f.g'.split(/\b/u, 3)).toStrictEqual(['a', '.', 'b']);
        expect(() => $str.split('a.b.c.d.e.f.g', /\b/u, 3)).toThrowError('EtjAg4dj');

        expect('a.b.c.d.e.f.g'.split(/[.]{0}/u, 3)).toStrictEqual(['a', '.', 'b']);
        expect(() => $str.split('a.b.c.d.e.f.g', /[.]{0}/u, 3)).toThrowError('EtjAg4dj');

        expect('headers\r\n\r\nbody content...\r\n\r\n...rest of body contents'.split('\r\n\r\n', 2)).toStrictEqual(['headers', 'body content...']);
        expect($str.split('headers\r\n\r\nbody content...\r\n\r\n...rest of body contents', '\r\n\r\n', 2)).toStrictEqual([
            'headers',
            'body content...\r\n\r\n' + //
                '...rest of body contents',
        ]);
    });
    test('.splitWords()', async () => {
        expect($str.splitWords('')).toStrictEqual([]);
        expect($str.splitWords('[heļlṏ, ꓺ ... 🦊 wɵrḻɖ!]')).toStrictEqual(['heļlṏ', 'ꓺ', 'wɵrḻɖ']);

        expect($str.splitWords('foo-bar-bazBiz-PascalCase-snake_case-kebab-case')) //
            .toStrictEqual(['foo', 'bar', 'baz', 'Biz', 'Pascal', 'Case', 'snake', 'case', 'kebab', 'case']);

        expect($str.splitWords('foo bar bazBiz PascalCase snake_case kebab-case', { whitespaceOnly: true })) //
            .toStrictEqual(['foo', 'bar', 'bazBiz', 'PascalCase', 'snake_case', 'kebab-case']);

        expect($str.splitWords('aeiouAEIOUaeiouyAEIOUYaeiouAEIOUanoANOaeiouyAEIOUYçÇßØøÅåÆæœ')) //
            .toStrictEqual(['aeiou', 'AEIO', 'Uaeiouy', 'AEIOU', 'Yaeiou', 'AEIO', 'Uano', 'AN', 'Oaeiouy', 'AEIOU', 'Yç', 'Çß', 'Øø', 'Åå', 'Ææœ']);

        expect($str.splitWords('àèìòùÀÈÌÒÙáéíóúýÁÉÍÓÚÝâêîôûÂÊÎÔÛãñõÃÑÕäëïöüÿÄËÏÖÜŸçÇßØøÅåÆæœ')) //
            .toStrictEqual(['àèìòù', 'ÀÈÌÒ', 'Ùáéíóúý', 'ÁÉÍÓÚ', 'Ýâêîôû', 'ÂÊÎÔ', 'Ûãñõ', 'ÃÑ', 'Õäëïöüÿ', 'ÄËÏÖÜ', 'Ÿç', 'Çß', 'Øø', 'Åå', 'Ææœ']);
    });
    test('.lowerFirst()', async () => {
        expect($str.lowerFirst('')).toBe('');
        expect($str.lowerFirst('Heļlṏ, ꓺ ... 🦊 wɵrḻɖ!')).toBe('heļlṏ, ꓺ ... 🦊 wɵrḻɖ!');
        expect($str.lowerFirst('[heļlṏ, ꓺ ... 🦊 wɵrḻɖ!]')).toBe('[heļlṏ, ꓺ ... 🦊 wɵrḻɖ!]');
        expect($str.lowerFirst('Foo-bar-bazBiz-PascalCase-snake_case-kebab-case')).toBe('foo-bar-bazBiz-PascalCase-snake_case-kebab-case');
        expect($str.lowerFirst('Foo bar bazBiz PascalCase snake_case kebab-case')).toBe('foo bar bazBiz PascalCase snake_case kebab-case');
        expect($str.lowerFirst('AeiouAEIOUaeiouyAEIOUYaeiouAEIOUanoANOaeiouyAEIOUYçÇßØøÅåÆæœ')).toBe('aeiouAEIOUaeiouyAEIOUYaeiouAEIOUanoANOaeiouyAEIOUYçÇßØøÅåÆæœ');
        expect($str.lowerFirst('àèìòùÀÈÌÒÙáéíóúýÁÉÍÓÚÝâêîôûÂÊÎÔÛãñõÃÑÕäëïöüÿÄËÏÖÜŸçÇßØøÅåÆæœ')).toBe('àèìòùÀÈÌÒÙáéíóúýÁÉÍÓÚÝâêîôûÂÊÎÔÛãñõÃÑÕäëïöüÿÄËÏÖÜŸçÇßØøÅåÆæœ');
        expect($str.lowerFirst('ÀÈÌÒÙàèìòùáéíóúýÁÉÍÓÚÝâêîôûÂÊÎÔÛãñõÃÑÕäëïöüÿÄËÏÖÜŸçÇßØøÅåÆæœ')).toBe('àÈÌÒÙàèìòùáéíóúýÁÉÍÓÚÝâêîôûÂÊÎÔÛãñõÃÑÕäëïöüÿÄËÏÖÜŸçÇßØøÅåÆæœ');
    });
    test('.upperFirst()', async () => {
        expect($str.upperFirst('')).toBe('');
        expect($str.upperFirst('heļlṏ, ꓺ ... 🦊 wɵrḻɖ!')).toBe('Heļlṏ, ꓺ ... 🦊 wɵrḻɖ!');
        expect($str.upperFirst('[heļlṏ, ꓺ ... 🦊 wɵrḻɖ!]')).toBe('[heļlṏ, ꓺ ... 🦊 wɵrḻɖ!]');
        expect($str.upperFirst('Foo-bar-bazBiz-PascalCase-snake_case-kebab-case')).toBe('Foo-bar-bazBiz-PascalCase-snake_case-kebab-case');
        expect($str.upperFirst('Foo bar bazBiz PascalCase snake_case kebab-case')).toBe('Foo bar bazBiz PascalCase snake_case kebab-case');
        expect($str.upperFirst('aeiouAEIOUaeiouyAEIOUYaeiouAEIOUanoANOaeiouyAEIOUYçÇßØøÅåÆæœ')).toBe('AeiouAEIOUaeiouyAEIOUYaeiouAEIOUanoANOaeiouyAEIOUYçÇßØøÅåÆæœ');
        expect($str.upperFirst('àèìòùÀÈÌÒÙáéíóúýÁÉÍÓÚÝâêîôûÂÊÎÔÛãñõÃÑÕäëïöüÿÄËÏÖÜŸçÇßØøÅåÆæœ')).toBe('ÀèìòùÀÈÌÒÙáéíóúýÁÉÍÓÚÝâêîôûÂÊÎÔÛãñõÃÑÕäëïöüÿÄËÏÖÜŸçÇßØøÅåÆæœ');
        expect($str.upperFirst('ÀÈÌÒÙàèìòùáéíóúýÁÉÍÓÚÝâêîôûÂÊÎÔÛãñõÃÑÕäëïöüÿÄËÏÖÜŸçÇßØøÅåÆæœ')).toBe('ÀÈÌÒÙàèìòùáéíóúýÁÉÍÓÚÝâêîôûÂÊÎÔÛãñõÃÑÕäëïöüÿÄËÏÖÜŸçÇßØøÅåÆæœ');
    });
    test('.capitalize()', async () => {
        expect($str.capitalize('')).toBe('');
        expect($str.capitalize('heļlṏ, ꓺ ... 🦊 wɵrḻɖ!')).toBe('Heļlṏ, ꓺ ... 🦊 wɵrḻɖ!');
        expect($str.capitalize('[heļlṏ, ꓺ ... 🦊 wɵrḻɖ!]')).toBe('[heļlṏ, ꓺ ... 🦊 wɵrḻɖ!]');
        expect($str.capitalize('Foo-bar-bazBiz-PascalCase-snake_case-kebab-case')).toBe('Foo-bar-bazbiz-pascalcase-snake_case-kebab-case');
        expect($str.capitalize('Foo bar bazBiz PascalCase snake_case kebab-case')).toBe('Foo bar bazbiz pascalcase snake_case kebab-case');
        expect($str.capitalize('aeiouAEIOUaeiouyAEIOUYaeiouAEIOUanoANOaeiouyAEIOUYçÇßØøÅåÆæœ')).toBe('Aeiouaeiouaeiouyaeiouyaeiouaeiouanoanoaeiouyaeiouyççßøøååææœ');
        expect($str.capitalize('àèìòùÀÈÌÒÙáéíóúýÁÉÍÓÚÝâêîôûÂÊÎÔÛãñõÃÑÕäëïöüÿÄËÏÖÜŸçÇßØøÅåÆæœ')).toBe('Àèìòùàèìòùáéíóúýáéíóúýâêîôûâêîôûãñõãñõäëïöüÿäëïöüÿççßøøååææœ');
        expect($str.capitalize('ÀÈÌÒÙàèìòùáéíóúýÁÉÍÓÚÝâêîôûÂÊÎÔÛãñõÃÑÕäëïöüÿÄËÏÖÜŸçÇßØøÅåÆæœ')).toBe('Àèìòùàèìòùáéíóúýáéíóúýâêîôûâêîôûãñõãñõäëïöüÿäëïöüÿççßøøååææœ');
    });
    test('.titleCase()', async () => {
        expect($str.titleCase('')).toBe('');

        expect($str.titleCase('heļlṏ, ꓺ ... 🦊 wɵrḻɖ!')).toBe('Heļlṏ ꓺ Wɵrḻɖ');
        expect($str.titleCase('[heļlṏ, ꓺ ... 🦊 wɵrḻɖ!]')).toBe('Heļlṏ ꓺ Wɵrḻɖ');

        expect($str.titleCase('Foo-bar-bazBiz-PascalCase-snake_case-kebab-case')).toBe('Foo Bar Baz Biz Pascal Case Snake Case Kebab Case');
        expect($str.titleCase('Foo bar bazBiz PascalCase snake_case kebab-case')).toBe('Foo Bar Baz Biz Pascal Case Snake Case Kebab Case');

        expect($str.titleCase('aeiouAEIOUaeiouyAEIOUYaeiouAEIOUanoANOaeiouyAEIOUYçÇßØøÅåÆæœ')).toBe('Aeiou Aeio Uaeiouy Aeiou Yaeiou Aeio Uano An Oaeiouy Aeiou Yç Çß Øø Åå Ææœ');
        expect($str.titleCase('àèìòùÀÈÌÒÙáéíóúýÁÉÍÓÚÝâêîôûÂÊÎÔÛãñõÃÑÕäëïöüÿÄËÏÖÜŸçÇßØøÅåÆæœ')).toBe('Àèìòù Àèìò Ùáéíóúý Áéíóú Ýâêîôû Âêîô Ûãñõ Ãñ Õäëïöüÿ Äëïöü Ÿç Çß Øø Åå Ææœ');
        expect($str.titleCase('ÀÈÌÒÙàèìòùáéíóúýÁÉÍÓÚÝâêîôûÂÊÎÔÛãñõÃÑÕäëïöüÿÄËÏÖÜŸçÇßØøÅåÆæœ')).toBe('Àèìò Ùàèìòùáéíóúý Áéíóú Ýâêîôû Âêîô Ûãñõ Ãñ Õäëïöüÿ Äëïöü Ÿç Çß Øø Åå Ææœ');

        expect($str.titleCase('ÀÈÌÒÙ àèìòùáéíóúýÁÉÍÓÚÝâêîôûÂÊÎÔÛãñõÃÑÕäëïöüÿÄËÏÖÜŸçÇßØøÅåÆæœ', { splitOnWhitespaceOnly: true })) //
            .toBe('Àèìòù Àèìòùáéíóúýáéíóúýâêîôûâêîôûãñõãñõäëïöüÿäëïöüÿççßøøååææœ');

        expect($str.titleCase('ÀÈÌÒÙàèìòùáéíóúýÁÉÍÓÚÝâêîôûÂÊÎÔÛãñõÃÑÕäëïöüÿÄËÏÖÜŸçÇßØøÅåÆæœ', { asciiOnly: true })) //
            .toBe('Aeio Uaeiouaeiouy Aeiou Yaeiou Aeio Uano An Oaeiouy Aeiou Yc C Aa');
    });
    test('.lowerCase()', async () => {
        expect($str.lowerCase('')).toBe('');

        expect($str.lowerCase('heļlṏ, ꓺ ... 🦊 wɵrḻɖ!')).toBe('heļlṏ ꓺ wɵrḻɖ');
        expect($str.lowerCase('[heļlṏ, ꓺ ... 🦊 wɵrḻɖ!]')).toBe('heļlṏ ꓺ wɵrḻɖ');

        expect($str.lowerCase('Foo-bar-bazBiz-PascalCase-snake_case-kebab-case')).toBe('foo bar baz biz pascal case snake case kebab case');
        expect($str.lowerCase('Foo bar bazBiz PascalCase snake_case kebab-case')).toBe('foo bar baz biz pascal case snake case kebab case');

        expect($str.lowerCase('aeiouAEIOUaeiouyAEIOUYaeiouAEIOUanoANOaeiouyAEIOUYçÇßØøÅåÆæœ')).toBe('aeiou aeio uaeiouy aeiou yaeiou aeio uano an oaeiouy aeiou yç çß øø åå ææœ');
        expect($str.lowerCase('àèìòùÀÈÌÒÙáéíóúýÁÉÍÓÚÝâêîôûÂÊÎÔÛãñõÃÑÕäëïöüÿÄËÏÖÜŸçÇßØøÅåÆæœ')).toBe('àèìòù àèìò ùáéíóúý áéíóú ýâêîôû âêîô ûãñõ ãñ õäëïöüÿ äëïöü ÿç çß øø åå ææœ');
        expect($str.lowerCase('ÀÈÌÒÙàèìòùáéíóúýÁÉÍÓÚÝâêîôûÂÊÎÔÛãñõÃÑÕäëïöüÿÄËÏÖÜŸçÇßØøÅåÆæœ')).toBe('àèìò ùàèìòùáéíóúý áéíóú ýâêîôû âêîô ûãñõ ãñ õäëïöüÿ äëïöü ÿç çß øø åå ææœ');

        expect($str.lowerCase('ÀÈÌÒÙ àèìòùáéíóúýÁÉÍÓÚÝâêîôûÂÊÎÔÛãñõÃÑÕäëïöüÿÄËÏÖÜŸçÇßØøÅåÆæœ', { splitOnWhitespaceOnly: true })) //
            .toBe('àèìòù àèìòùáéíóúýáéíóúýâêîôûâêîôûãñõãñõäëïöüÿäëïöüÿççßøøååææœ');

        expect($str.lowerCase('ÀÈÌÒÙàèìòùáéíóúýÁÉÍÓÚÝâêîôûÂÊÎÔÛãñõÃÑÕäëïöüÿÄËÏÖÜŸçÇßØøÅåÆæœ', { asciiOnly: true })) //
            .toBe('aeio uaeiouaeiouy aeiou yaeiou aeio uano an oaeiouy aeiou yc c aa');
    });
    test('.upperCase()', async () => {
        expect($str.upperCase('')).toBe('');

        expect($str.upperCase('heļlṏ, ꓺ ... 🦊 wɵrḻɖ!')).toBe('HEĻLṎ ꓺ WƟRḺƉ');
        expect($str.upperCase('[heļlṏ, ꓺ ... 🦊 wɵrḻɖ!]')).toBe('HEĻLṎ ꓺ WƟRḺƉ');

        expect($str.upperCase('Foo-bar-bazBiz-PascalCase-snake_case-kebab-case')).toBe('FOO BAR BAZ BIZ PASCAL CASE SNAKE CASE KEBAB CASE');
        expect($str.upperCase('Foo bar bazBiz PascalCase snake_case kebab-case')).toBe('FOO BAR BAZ BIZ PASCAL CASE SNAKE CASE KEBAB CASE');

        expect($str.upperCase('aeiouAEIOUaeiouyAEIOUYaeiouAEIOUanoANOaeiouyAEIOUYçÇßØøÅåÆæœ')).toBe('AEIOU AEIO UAEIOUY AEIOU YAEIOU AEIO UANO AN OAEIOUY AEIOU YÇ ÇSS ØØ ÅÅ ÆÆŒ');
        expect($str.upperCase('àèìòùÀÈÌÒÙáéíóúýÁÉÍÓÚÝâêîôûÂÊÎÔÛãñõÃÑÕäëïöüÿÄËÏÖÜŸçÇßØøÅåÆæœ')).toBe('ÀÈÌÒÙ ÀÈÌÒ ÙÁÉÍÓÚÝ ÁÉÍÓÚ ÝÂÊÎÔÛ ÂÊÎÔ ÛÃÑÕ ÃÑ ÕÄËÏÖÜŸ ÄËÏÖÜ ŸÇ ÇSS ØØ ÅÅ ÆÆŒ');
        expect($str.upperCase('ÀÈÌÒÙàèìòùáéíóúýÁÉÍÓÚÝâêîôûÂÊÎÔÛãñõÃÑÕäëïöüÿÄËÏÖÜŸçÇßØøÅåÆæœ')).toBe('ÀÈÌÒ ÙÀÈÌÒÙÁÉÍÓÚÝ ÁÉÍÓÚ ÝÂÊÎÔÛ ÂÊÎÔ ÛÃÑÕ ÃÑ ÕÄËÏÖÜŸ ÄËÏÖÜ ŸÇ ÇSS ØØ ÅÅ ÆÆŒ');

        expect($str.upperCase('ÀÈÌÒÙ àèìòùáéíóúýÁÉÍÓÚÝâêîôûÂÊÎÔÛãñõÃÑÕäëïöüÿÄËÏÖÜŸçÇßØøÅåÆæœ', { splitOnWhitespaceOnly: true })) //
            .toBe('ÀÈÌÒÙ ÀÈÌÒÙÁÉÍÓÚÝÁÉÍÓÚÝÂÊÎÔÛÂÊÎÔÛÃÑÕÃÑÕÄËÏÖÜŸÄËÏÖÜŸÇÇSSØØÅÅÆÆŒ');

        expect($str.upperCase('ÀÈÌÒÙàèìòùáéíóúýÁÉÍÓÚÝâêîôûÂÊÎÔÛãñõÃÑÕäëïöüÿÄËÏÖÜŸçÇßØøÅåÆæœ', { asciiOnly: true })) //
            .toBe('AEIO UAEIOUAEIOUY AEIOU YAEIOU AEIO UANO AN OAEIOUY AEIOU YC C AA');
    });
    test('.studlyCase()', async () => {
        expect($str.studlyCase('')).toBe('');

        expect($str.studlyCase('heļlṏ, ꓺ ... 🦊 wɵrḻɖ!')).toBe('HeļlṏꓺWɵrḻɖ');
        expect($str.studlyCase('[heļlṏ, ꓺ ... 🦊 wɵrḻɖ!]')).toBe('HeļlṏꓺWɵrḻɖ');

        expect($str.studlyCase('Foo-bar-bazBiz-PascalCase-snake_case-kebab-case')).toBe('FooBarBazBizPascalCaseSnakeCaseKebabCase');
        expect($str.studlyCase('Foo bar bazBiz PascalCase snake_case kebab-case')).toBe('FooBarBazBizPascalCaseSnakeCaseKebabCase');

        expect($str.studlyCase('aeiouAEIOUaeiouyAEIOUYaeiouAEIOUanoANOaeiouyAEIOUYçÇßØøÅåÆæœ')).toBe('AeiouAeioUaeiouyAeiouYaeiouAeioUanoAnOaeiouyAeiouYçÇßØøÅåÆæœ');
        expect($str.studlyCase('àèìòùÀÈÌÒÙáéíóúýÁÉÍÓÚÝâêîôûÂÊÎÔÛãñõÃÑÕäëïöüÿÄËÏÖÜŸçÇßØøÅåÆæœ')).toBe('ÀèìòùÀèìòÙáéíóúýÁéíóúÝâêîôûÂêîôÛãñõÃñÕäëïöüÿÄëïöüŸçÇßØøÅåÆæœ');
        expect($str.studlyCase('ÀÈÌÒÙàèìòùáéíóúýÁÉÍÓÚÝâêîôûÂÊÎÔÛãñõÃÑÕäëïöüÿÄËÏÖÜŸçÇßØøÅåÆæœ')).toBe('ÀèìòÙàèìòùáéíóúýÁéíóúÝâêîôûÂêîôÛãñõÃñÕäëïöüÿÄëïöüŸçÇßØøÅåÆæœ');

        expect($str.studlyCase('1ÀÈÌÒÙ àèìòùáéíóúýÁÉÍÓÚÝâêîôûÂÊÎÔÛãñõÃÑÕäëïöüÿÄËÏÖÜŸçÇßØøÅåÆæœ', { letterFirst: 'X' })) //
            .toBe('X1ÀèìòùÀèìòùáéíóúýÁéíóúÝâêîôûÂêîôÛãñõÃñÕäëïöüÿÄëïöüŸçÇßØøÅåÆæœ');

        expect($str.studlyCase('ÀÈÌÒÙàèìòùáéíóúýÁÉÍÓÚÝâêîôûÂÊÎÔÛãñõÃÑÕäëïöüÿÄËÏÖÜŸçÇßØøÅåÆæœ', { asciiOnly: true })) //
            .toBe('AeioUaeiouaeiouyAeiouYaeiouAeioUanoAnOaeiouyAeiouYcCAa');
    });
    test('.camelCase()', async () => {
        expect($str.camelCase('')).toBe('');

        expect($str.camelCase('heļlṏ, ꓺ ... 🦊 wɵrḻɖ!')).toBe('heļlṏꓺwɵrḻɖ');
        expect($str.camelCase('[heļlṏ, ꓺ ... 🦊 wɵrḻɖ!]')).toBe('heļlṏꓺwɵrḻɖ');

        expect($str.camelCase('Foo-bar-bazBiz-PascalCase-snake_case-kebab-case')).toBe('fooBarBazBizPascalCaseSnakeCaseKebabCase');
        expect($str.camelCase('Foo bar bazBiz PascalCase snake_case kebab-case')).toBe('fooBarBazBizPascalCaseSnakeCaseKebabCase');

        expect($str.camelCase('aeiouAEIOUaeiouyAEIOUYaeiouAEIOUanoANOaeiouyAEIOUYçÇßØøÅåÆæœ')).toBe('aeiouAeioUaeiouyAeiouYaeiouAeioUanoAnOaeiouyAeiouYçÇßØøÅåÆæœ');
        expect($str.camelCase('àèìòùÀÈÌÒÙáéíóúýÁÉÍÓÚÝâêîôûÂÊÎÔÛãñõÃÑÕäëïöüÿÄËÏÖÜŸçÇßØøÅåÆæœ')).toBe('àèìòùÀèìòÙáéíóúýÁéíóúÝâêîôûÂêîôÛãñõÃñÕäëïöüÿÄëïöüŸçÇßØøÅåÆæœ');
        expect($str.camelCase('ÀÈÌÒÙàèìòùáéíóúýÁÉÍÓÚÝâêîôûÂÊÎÔÛãñõÃÑÕäëïöüÿÄËÏÖÜŸçÇßØøÅåÆæœ')).toBe('àèìòÙàèìòùáéíóúýÁéíóúÝâêîôûÂêîôÛãñõÃñÕäëïöüÿÄëïöüŸçÇßØøÅåÆæœ');

        expect($str.camelCase('1ÀÈÌÒÙ àèìòùáéíóúýÁÉÍÓÚÝâêîôûÂÊÎÔÛãñõÃÑÕäëïöüÿÄËÏÖÜŸçÇßØøÅåÆæœ', { letterFirst: 'x' })) //
            .toBe('x1ÀèìòùÀèìòùáéíóúýÁéíóúÝâêîôûÂêîôÛãñõÃñÕäëïöüÿÄëïöüŸçÇßØøÅåÆæœ');

        expect($str.camelCase('ÀÈÌÒÙàèìòùáéíóúýÁÉÍÓÚÝâêîôûÂÊÎÔÛãñõÃÑÕäëïöüÿÄËÏÖÜŸçÇßØøÅåÆæœ', { asciiOnly: true })) //
            .toBe('aeioUaeiouaeiouyAeiouYaeiouAeioUanoAnOaeiouyAeiouYcCAa');
    });
    test('.kebabCase()', async () => {
        expect($str.kebabCase('')).toBe('');

        expect($str.kebabCase('heļlṏ, ꓺ ... 🦊 wɵrḻɖ!')).toBe('heļlṏ-ꓺwɵrḻɖ');
        expect($str.kebabCase('[heļlṏ, ꓺ ... 🦊 wɵrḻɖ!]')).toBe('heļlṏ-ꓺwɵrḻɖ');

        expect($str.kebabCase('Foo-bar-bazBiz-PascalCase-snake_case-kebab-case')).toBe('foo-bar-baz-biz-pascal-case-snake-case-kebab-case');
        expect($str.kebabCase('Foo bar bazBiz PascalCase snake_case kebab-case')).toBe('foo-bar-baz-biz-pascal-case-snake-case-kebab-case');

        expect($str.kebabCase('aeiouAEIOUaeiouyAEIOUYaeiouAEIOUanoANOaeiouyAEIOUYçÇßØøÅåÆæœ')).toBe('aeiou-aeio-uaeiouy-aeiou-yaeiou-aeio-uano-an-oaeiouy-aeiou-yç-çß-øø-åå-ææœ');
        expect($str.kebabCase('àèìòùÀÈÌÒÙáéíóúýÁÉÍÓÚÝâêîôûÂÊÎÔÛãñõÃÑÕäëïöüÿÄËÏÖÜŸçÇßØøÅåÆæœ')).toBe('àèìòù-àèìò-ùáéíóúý-áéíóú-ýâêîôû-âêîô-ûãñõ-ãñ-õäëïöüÿ-äëïöü-ÿç-çß-øø-åå-ææœ');
        expect($str.kebabCase('ÀÈÌÒÙàèìòùáéíóúýÁÉÍÓÚÝâêîôûÂÊÎÔÛãñõÃÑÕäëïöüÿÄËÏÖÜŸçÇßØøÅåÆæœ')).toBe('àèìò-ùàèìòùáéíóúý-áéíóú-ýâêîôû-âêîô-ûãñõ-ãñ-õäëïöüÿ-äëïöü-ÿç-çß-øø-åå-ææœ');

        expect($str.kebabCase('1ÀÈÌÒÙ àèìòùáéíóúýÁÉÍÓÚÝâêîôûÂÊÎÔÛãñõÃÑÕäëïöüÿÄËÏÖÜŸçÇßØøÅåÆæœ', { letterFirst: 'x' })) //
            .toBe('x1-àèìòù-àèìòùáéíóúý-áéíóú-ýâêîôû-âêîô-ûãñõ-ãñ-õäëïöüÿ-äëïöü-ÿç-çß-øø-åå-ææœ');

        expect($str.kebabCase('ÀÈÌÒÙàèìòùáéíóúýÁÉÍÓÚÝâêîôûÂÊÎÔÛãñõÃÑÕäëïöüÿÄËÏÖÜŸçÇßØøÅåÆæœ', { asciiOnly: true })) //
            .toBe('aeio-uaeiouaeiouy-aeiou-yaeiou-aeio-uano-an-oaeiouy-aeiou-yc-c-aa');

        expect($str.kebabCase('ꓺÀꓺÈꓺÌÒÙàèìòùáéíóúýÁÉÍÓÚÝâêîôûÂÊÎÔÛãñõÃÑÕäëïöüÿÄËÏÖÜŸçÇßØøÅåÆæœ')) // Letter modifiers.
            .toBe('ꓺàꓺèꓺìò-ùàèìòùáéíóúý-áéíóú-ýâêîôû-âêîô-ûãñõ-ãñ-õäëïöüÿ-äëïöü-ÿç-çß-øø-åå-ææœ');
    });
    test('.snakeCase()', async () => {
        expect($str.snakeCase('')).toBe('');

        expect($str.snakeCase('heļlṏ, ꓺ ... 🦊 wɵrḻɖ!')).toBe('heļlṏ_ꓺwɵrḻɖ');
        expect($str.snakeCase('[heļlṏ, ꓺ ... 🦊 wɵrḻɖ!]')).toBe('heļlṏ_ꓺwɵrḻɖ');

        expect($str.snakeCase('Foo-bar-bazBiz-PascalCase-snake_case-kebab-case')).toBe('foo_bar_baz_biz_pascal_case_snake_case_kebab_case');
        expect($str.snakeCase('Foo bar bazBiz PascalCase snake_case kebab-case')).toBe('foo_bar_baz_biz_pascal_case_snake_case_kebab_case');

        expect($str.snakeCase('aeiouAEIOUaeiouyAEIOUYaeiouAEIOUanoANOaeiouyAEIOUYçÇßØøÅåÆæœ')).toBe('aeiou_aeio_uaeiouy_aeiou_yaeiou_aeio_uano_an_oaeiouy_aeiou_yç_çß_øø_åå_ææœ');
        expect($str.snakeCase('àèìòùÀÈÌÒÙáéíóúýÁÉÍÓÚÝâêîôûÂÊÎÔÛãñõÃÑÕäëïöüÿÄËÏÖÜŸçÇßØøÅåÆæœ')).toBe('àèìòù_àèìò_ùáéíóúý_áéíóú_ýâêîôû_âêîô_ûãñõ_ãñ_õäëïöüÿ_äëïöü_ÿç_çß_øø_åå_ææœ');
        expect($str.snakeCase('ÀÈÌÒÙàèìòùáéíóúýÁÉÍÓÚÝâêîôûÂÊÎÔÛãñõÃÑÕäëïöüÿÄËÏÖÜŸçÇßØøÅåÆæœ')).toBe('àèìò_ùàèìòùáéíóúý_áéíóú_ýâêîôû_âêîô_ûãñõ_ãñ_õäëïöüÿ_äëïöü_ÿç_çß_øø_åå_ææœ');

        expect($str.snakeCase('1ÀÈÌÒÙ àèìòùáéíóúýÁÉÍÓÚÝâêîôûÂÊÎÔÛãñõÃÑÕäëïöüÿÄËÏÖÜŸçÇßØøÅåÆæœ', { letterFirst: 'x' })) //
            .toBe('x1_àèìòù_àèìòùáéíóúý_áéíóú_ýâêîôû_âêîô_ûãñõ_ãñ_õäëïöüÿ_äëïöü_ÿç_çß_øø_åå_ææœ');

        expect($str.snakeCase('ÀÈÌÒÙàèìòùáéíóúýÁÉÍÓÚÝâêîôûÂÊÎÔÛãñõÃÑÕäëïöüÿÄËÏÖÜŸçÇßØøÅåÆæœ', { asciiOnly: true })) //
            .toBe('aeio_uaeiouaeiouy_aeiou_yaeiou_aeio_uano_an_oaeiouy_aeiou_yc_c_aa');

        expect($str.snakeCase('ꓺÀꓺÈꓺÌÒÙàèìòùáéíóúýÁÉÍÓÚÝâêîôûÂÊÎÔÛãñõÃÑÕäëïöüÿÄËÏÖÜŸçÇßØøÅåÆæœ')) // Letter modifiers.
            .toBe('ꓺàꓺèꓺìò_ùàèìòùáéíóúý_áéíóú_ýâêîôû_âêîô_ûãñõ_ãñ_õäëïöüÿ_äëïöü_ÿç_çß_øø_åå_ææœ');
    });
    test('.parseValue()', async () => {
        expect($str.snakeCase('')).toBe('');

        expect($str.parseValue('null')).toBe(null);
        expect($str.parseValue('null*')).toBe('null');

        expect($str.parseValue('undefined')).toBe(undefined);
        expect($str.parseValue('undefined*')).toBe('undefined');

        expect($str.parseValue('true')).toBe(true);
        expect($str.parseValue('true*')).toBe('true');

        expect($str.parseValue('false')).toBe(false);
        expect($str.parseValue('false*')).toBe('false');

        expect($is.nan($str.parseValue('NaN'))).toBe(true);
        expect($str.parseValue('NaN*')).toBe('NaN');

        expect($str.parseValue('false')).toBe(false);
        expect($str.parseValue('false*')).toBe('false');

        expect($str.parseValue('-Infinity')).toBe(-Infinity);
        expect($str.parseValue('-Infinity*')).toBe('-Infinity');

        expect($str.parseValue('Infinity')).toBe(Infinity);
        expect($str.parseValue('Infinity*')).toBe('Infinity');

        expect($str.parseValue('0')).toBe(0);
        expect($str.parseValue('0*')).toBe('0');

        expect($str.parseValue('123')).toBe(123);
        expect($str.parseValue('123*')).toBe('123');

        expect($str.parseValue('0.0')).toBe(0.0);
        expect($str.parseValue('0.0*')).toBe('0.0');

        expect($str.parseValue('1.23')).toBe(1.23);
        expect($str.parseValue('1.23*')).toBe('1.23');
    });
    test('.quote()', async () => {
        expect($str.quote('foo')).toBe("'foo'");

        expect($str.quote('aeiouAEIOUaeiouyAEIOUYaeiouÂÊÎÔÛãñõÃÑÕäëïöüÿÄËÏÖÜŸçÇßØøÅåÆæœ')) //
            .toBe("'aeiouAEIOUaeiouyAEIOUYaeiouÂÊÎÔÛãñõÃÑÕäëïöüÿÄËÏÖÜŸçÇßØøÅåÆæœ'");

        expect($str.quote("!#aeiouAE'sIOUaeiouyAEIOUYaeiouÂÊÎÔÛãñõÃÑÕäëïöüÿÄËÏÖÜŸçÇßØøÅåÆæœ")) //
            .toBe("'!#aeiouAE\\'sIOUaeiouyAEIOUYaeiouÂÊÎÔÛãñõÃÑÕäëïöüÿÄËÏÖÜŸçÇßØøÅåÆæœ'");

        expect($str.quote('foo', { type: 'single' })).toBe("'foo'");

        expect($str.quote('aeiouAEIOUaeiouyAEIOUYaeiouÂÊÎÔÛãñõÃÑÕäëïöüÿÄËÏÖÜŸçÇßØøÅåÆæœ', { type: 'single' })) //
            .toBe("'aeiouAEIOUaeiouyAEIOUYaeiouÂÊÎÔÛãñõÃÑÕäëïöüÿÄËÏÖÜŸçÇßØøÅåÆæœ'");

        expect($str.quote("!#aeiouAE'sIOUaeiouyAEIOUYaeiouÂÊÎÔÛãñõÃÑÕäëïöüÿÄËÏÖÜŸçÇßØøÅåÆæœ", { type: 'single' })) //
            .toBe("'!#aeiouAE\\'sIOUaeiouyAEIOUYaeiouÂÊÎÔÛãñõÃÑÕäëïöüÿÄËÏÖÜŸçÇßØøÅåÆæœ'");

        expect($str.quote('foo', { type: 'double' })).toBe('"foo"');

        expect($str.quote('aeiouAEIOUaeiouyAEIOUYaeiouÂÊÎÔÛãñõÃÑÕäëïöüÿÄËÏÖÜŸçÇßØøÅåÆæœ', { type: 'double' })) //
            .toBe('"aeiouAEIOUaeiouyAEIOUYaeiouÂÊÎÔÛãñõÃÑÕäëïöüÿÄËÏÖÜŸçÇßØøÅåÆæœ"');

        expect($str.quote('!#aeiouAE\'"sIOUaeiouyAEIOUYaeiouÂÊÎÔÛãñõÃÑÕäëïöüÿÄËÏÖÜŸçÇßØøÅåÆæœ', { type: 'double' })) //
            .toBe('"!#aeiouAE\'\\"sIOUaeiouyAEIOUYaeiouÂÊÎÔÛãñõÃÑÕäëïöüÿÄËÏÖÜŸçÇßØøÅåÆæœ"');
    });
    test('.quote()', async () => {
        expect($str.unquote($str.quote('foo'))).toBe('foo');

        expect($str.unquote($str.quote('aeiouAEIOUaeiouyAEIOUYaeiouÂÊÎÔÛãñõÃÑÕäëïöüÿÄËÏÖÜŸçÇßØøÅåÆæœ'))) //
            .toBe('aeiouAEIOUaeiouyAEIOUYaeiouÂÊÎÔÛãñõÃÑÕäëïöüÿÄËÏÖÜŸçÇßØøÅåÆæœ');

        expect($str.unquote($str.quote("!#aeiouAE'sIOUaeiouyAEIOUYaeiouÂÊÎÔÛãñõÃÑÕäëïöüÿÄËÏÖÜŸçÇßØøÅåÆæœ"))) //
            .toBe("!#aeiouAE'sIOUaeiouyAEIOUYaeiouÂÊÎÔÛãñõÃÑÕäëïöüÿÄËÏÖÜŸçÇßØøÅåÆæœ");

        expect($str.unquote($str.quote('foo', { type: 'single' }))).toBe('foo');

        expect($str.unquote($str.quote('aeiouAEIOUaeiouyAEIOUYaeiouÂÊÎÔÛãñõÃÑÕäëïöüÿÄËÏÖÜŸçÇßØøÅåÆæœ', { type: 'single' }))) //
            .toBe('aeiouAEIOUaeiouyAEIOUYaeiouÂÊÎÔÛãñõÃÑÕäëïöüÿÄËÏÖÜŸçÇßØøÅåÆæœ');

        expect($str.unquote($str.quote("!#aeiouAE'sIOUaeiouyAEIOUYaeiouÂÊÎÔÛãñõÃÑÕäëïöüÿÄËÏÖÜŸçÇßØøÅåÆæœ", { type: 'single' }))) //
            .toBe("!#aeiouAE'sIOUaeiouyAEIOUYaeiouÂÊÎÔÛãñõÃÑÕäëïöüÿÄËÏÖÜŸçÇßØøÅåÆæœ");

        expect($str.unquote($str.quote('foo', { type: 'double' }))).toBe('foo');

        expect($str.unquote($str.quote('aeiouAEIOUaeiouyAEIOUYaeiouÂÊÎÔÛãñõÃÑÕäëïöüÿÄËÏÖÜŸçÇßØøÅåÆæœ', { type: 'double' }))) //
            .toBe('aeiouAEIOUaeiouyAEIOUYaeiouÂÊÎÔÛãñõÃÑÕäëïöüÿÄËÏÖÜŸçÇßØøÅåÆæœ');

        expect($str.unquote($str.quote('!#aeiouAE\'"sIOUaeiouyAEIOUYaeiouÂÊÎÔÛãñõÃÑÕäëïöüÿÄËÏÖÜŸçÇßØøÅåÆæœ', { type: 'double' }))) //
            .toBe('!#aeiouAE\'"sIOUaeiouyAEIOUYaeiouÂÊÎÔÛãñõÃÑÕäëïöüÿÄËÏÖÜŸçÇßØøÅåÆæœ');
    });
    test('.escHTML()', async () => {
        expect($str.escHTML('<foo> & <"aeiouAEIOUaeiouyAEIOUYaeiouÂÊÎÔÛãñõÃÑÕäëïöüÿÄËÏÖÜŸçÇßØøÅåÆæœ\'>')) //
            .toBe('&lt;foo&gt; &amp; &lt;&quot;aeiouAEIOUaeiouyAEIOUYaeiouÂÊÎÔÛãñõÃÑÕäëïöüÿÄËÏÖÜŸçÇßØøÅåÆæœ&apos;&gt;');

        expect($str.escHTML('<foo> & &amp; <"heļlṏ, ꓺ ... 🦊 wɵrḻɖ!\'>')).toBe('&lt;foo&gt; &amp; &amp; &lt;&quot;heļlṏ, ꓺ ... 🦊 wɵrḻɖ!&apos;&gt;');
        expect($str.escHTML('<foo> & &amp; <"heļlṏ, ꓺ ... 🦊 wɵrḻɖ!\'>', { doubleEncode: true })).toBe('&lt;foo&gt; &amp; &amp;amp; &lt;&quot;heļlṏ, ꓺ ... 🦊 wɵrḻɖ!&apos;&gt;');
    });
    test('.unescHTML()', async () => {
        expect($str.unescHTML('&lt;foo&gt; &amp; &lt;&quot;aeiouAEIOUaeiouyAEIOUYaeiouÂÊÎÔÛãñõÃÑÕäëïöüÿÄËÏÖÜŸçÇßØøÅåÆæœ&apos;&gt;')) //
            .toBe('<foo> & <"aeiouAEIOUaeiouyAEIOUYaeiouÂÊÎÔÛãñõÃÑÕäëïöüÿÄËÏÖÜŸçÇßØøÅåÆæœ\'>');

        expect($str.unescHTML('&lt;foo&gt; &amp; &amp; &lt;&quot;heļlṏ, ꓺ ... 🦊 wɵrḻɖ!&apos;&gt;')).toBe('<foo> & & <"heļlṏ, ꓺ ... 🦊 wɵrḻɖ!\'>');
        expect($str.unescHTML('&lt;foo&gt; &amp; &amp;amp; &lt;&quot;heļlṏ, ꓺ ... 🦊 wɵrḻɖ!&apos;&gt;')).toBe('<foo> & &amp; <"heļlṏ, ꓺ ... 🦊 wɵrḻɖ!\'>');
    });
    test('.escRegExp()', async () => {
        expect($str.escRegExp('.*+?^${}()|[]\\')).toBe('\\.\\*\\+\\?\\^\\$\\{\\}\\(\\)\\|\\[\\]\\\\');
        expect($str.escRegExp('aeiouAEIOUaeiouyAEIOUYaeiouÂÊÎÔÛãñõÃÑÕäëïöüÿÄËÏÖÜŸçÇßØøÅåÆæœ.*+?^${}()|[]\\')) //
            .toBe('aeiouAEIOUaeiouyAEIOUYaeiouÂÊÎÔÛãñõÃÑÕäëïöüÿÄËÏÖÜŸçÇßØøÅåÆæœ\\.\\*\\+\\?\\^\\$\\{\\}\\(\\)\\|\\[\\]\\\\');
    });
    test('.escSelector()', async () => {
        expect($str.escSelector('!"#$%&\'()*+,./:;<=>?@[\\]^`{|}~')).toBe('\\!\\"\\#\\$\\%\\&\\\'\\(\\)\\*\\+\\,\\.\\/\\:\\;\\<\\=\\>\\?\\@\\[\\\\\\]\\^\\`\\{\\|\\}\\~');
        expect($str.escSelector('aeiouAEIOUaeiouyAEIOUYaeiouÂÊÎÔÛãñõÃÑÕäëïöüÿÄËÏÖÜŸçÇßØøÅåÆæœ!"#$%&\'()*+,./:;<=>?@[\\]^`{|}~')) //
            .toBe('aeiouAEIOUaeiouyAEIOUYaeiouÂÊÎÔÛãñõÃÑÕäëïöüÿÄËÏÖÜŸçÇßØøÅåÆæœ\\!\\"\\#\\$\\%\\&\\\'\\(\\)\\*\\+\\,\\.\\/\\:\\;\\<\\=\\>\\?\\@\\[\\\\\\]\\^\\`\\{\\|\\}\\~');
    });
    test('.escFTSQuery()', async () => {
        expect($str.escFTSQuery('site: foo bar')).toBe('site: foo bar');
        expect($str.escFTSQuery('- site: foo bar')).toBe('- site: foo bar');
        expect($str.escFTSQuery('snippet: foo bar')).toBe('snippet: foo bar');

        expect($str.escFTSQuery('{site}: foo bar')).toBe('{site}: foo bar');
        expect($str.escFTSQuery('- {site}: foo bar')).toBe('- {site}: foo bar');
        expect($str.escFTSQuery('{site title snippet}: foo bar')).toBe('{site title snippet}: foo bar');

        expect($str.escFTSQuery('{site title snippet}: foo -bar')).toBe('{site title snippet}: foo -bar');
        expect($str.escFTSQuery('{site title snippet}: foo -b.a-r')).toBe('{site title snippet}: foo -b"."a"-"r');
        expect($str.escFTSQuery('{site title snippet}: foo OR -b.a-r')).toBe('{site title snippet}: foo OR -b"."a"-"r');
        expect($str.escFTSQuery('{site title snippet}: (fo-:o) OR (-b.a-r)')).toBe('{site title snippet}: (fo"-"":"o) OR (-b"."a"-"r)');

        expect($str.escFTSQuery('{site title snippet}: (foo) OR (^-b.a-r)')).toBe('{site title snippet}: (foo) OR (^"-"b"."a"-"r)');
        expect($str.escFTSQuery('{site title snippet}: (foo) OR (^ -b.a-r)')).toBe('{site title snippet}: (foo) OR (^ -b"."a"-"r)');

        expect($str.escFTSQuery('{site title snippet}: (foo) OR ({site snippet}: -b.a-r)')).toBe('{site title snippet}: (foo) OR ({site snippet}: -b"."a"-"r)');
        expect($str.escFTSQuery('{site title snippet}: (foo) OR ({site snippet}: ^ -b.a-r)')).toBe('{site title snippet}: (foo) OR ({site snippet}: ^ -b"."a"-"r)');

        expect($str.escFTSQuery('!@#$%^&*(:)')).toBe('"!@#$%""^""&"*(":")');
    });
    test('.isEmail()', async () => {
        expect($str.isEmail('x@x')).toBe(true);
        expect($str.isEmail('x+x@x')).toBe(true);

        expect($str.isEmail('x@localhost')).toBe(true);
        expect($str.isEmail('x+x@localhost')).toBe(true);

        expect($str.isEmail('x@hop.gdn')).toBe(true);
        expect($str.isEmail('x+x@hop.gdn')).toBe(true);

        expect($str.isEmail('x@x,x')).toBe(false);
        expect($str.isEmail('x,x@x')).toBe(false);
        expect($str.isEmail('<x@hop.gdn>')).toBe(false);
        expect($str.isEmail('x @hop.gdn')).toBe(false);

        for (const validEmail of [
            'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ@letters-in-local.org',
            'A-Za-z0-9.!#$%&’*+/=?^_`{|}~-@other-valid-characters-in-local.net',
            '01234567890@numbers-in-local.net',
            'mixed-1234-in-{+^}-local@sld.net',
            'a@single-character-in-local.org',
            'one-character-third-level@a.example.com',
            'single-character-in-sld@x.org',
            'local@dash-in-sld.com',
            'letters-in-sld@123.com',
            'one-letter-sld@x.org',
            'test@test--1.com',
            'uncommon-tld@sld.museum',
            'uncommon-tld@sld.travel',
            'uncommon-tld@sld.mobi',
            'country-code-tld@sld.uk',
            'country-code-tld@sld.rw',
            'local@sld.newTLD',
            'local@sub.domains.com',
            'backticks`are`legit@test.com',
            'digit-only-domain@123.com',
            'missing-dot-before-tld@com',
            'digit-only-domain-with-subdomain@sub.123.com',
            'punycode-numbers-in-tld@sld.xn--3e0b707e',
            '.local-starts-with-dot@sld.com',
            'local-ends-with-dot.@sld.com',
            'two..consecutive-dots@sld.com',
            'sld-ends-with-dash@sld-.com',
            'sld-starts-with-dashsh@-sld.com',
            'unbracketed-IP@127.0.0.1',
            'invalid-ip@127.0.0.1.26',
            'another-invalid-ip@127.0.0.256',
            'mg@ns.i',
        ]) {
            expect($str.isEmail(validEmail), validEmail).toBe(true);
        }
        for (const validEmail of [
            '"quoted"@sld.com',
            '"\\e\\s\\c\\a\\p\\e\\d"@sld.com',
            '"quoted-at-sign@sld.org"@sld.com',
            '"escaped\\"quote"@sld.com',
            '"back\\slash"@sld.com',
            'bracketed-IP-instead-of-domain@[127.0.0.1]',
            '@missing-local.org',
            '! #$%`|@invalid-characters-in-local.org',
            '(),:;`|@more-invalid-characters-in-local.org',
            '<>@[]\\`|@even-more-invalid-characters-in-local.org',
            'partially."quoted"@sld.com',
            'the-local-part-is-invalid-if-it-is-longer-than-sixty-four-characters@sld.net',
            'missing-sld@.com',
            'invalid-characters-in-sld@! "#$%(),/;<>_[]`|.org',
            'missing-tld@sld.',
            'invalid',
            'missing-at-sign.net',
            'IP-and-port@127.0.0.1:25',
            'trailing-dots@test.de.',
            'dot-on-dot-in-domainname@te..st.de',
            'dot-first-in-domain@.test.de',
        ]) {
            expect($str.isEmail(validEmail), validEmail).toBe(false);
        }
    });
    test('.isAddr()', async () => {
        expect($str.isAddr('x@x')).toBe(true);
        expect($str.isAddr('x+x@x')).toBe(true);

        expect($str.isAddr('x@localhost')).toBe(true);
        expect($str.isAddr('x+x@localhost')).toBe(true);

        expect($str.isAddr('x@hop.gdn')).toBe(true);
        expect($str.isAddr('x+x@hop.gdn')).toBe(true);

        expect($str.isAddr('"X" <x@x>')).toBe(true);
        expect($str.isAddr('"X" <x+x@x>')).toBe(true);

        expect($str.isAddr('"X" <x@localhost>')).toBe(true);
        expect($str.isAddr('"X" <x+x@localhost>')).toBe(true);

        expect($str.isAddr('"X" <x@hop.gdn>')).toBe(true);
        expect($str.isAddr('"X" <x+x@hop.gdn>')).toBe(true);

        expect($str.isAddr('"X" <x@x>')).toBe(true);
        expect($str.isAddr('"X X" <x@x>')).toBe(true);

        expect($str.isAddr('x@x,x')).toBe(false);
        expect($str.isAddr('x,x@x')).toBe(false);
        expect($str.isAddr('<x@hop.gdn>')).toBe(false);
        expect($str.isAddr('x @hop.gdn')).toBe(false);

        expect($str.isAddr('X x@x')).toBe(false);
        expect($str.isAddr('"X" x@x')).toBe(false);
        expect($str.isAddr('"" <x@x>')).toBe(false);
        expect($str.isAddr('"X"  <x@x>')).toBe(false);
        expect($str.isAddr('"X" <x@>')).toBe(false);
        expect($str.isAddr('"X" <@x>')).toBe(false);
    });
    test('.test()', async () => {
        expect($str.test('aeiouAEIOUaeiouyAEIOUYaeiou ꓺ ... 🦊 ÂÊÎÔÛãñõÃÑÕäëïöüÿÄËÏÖÜŸçÇßØøÅåÆæœ🦊', /^aeiou.*$/u)).toBe(true);
        expect($str.test('aeiouAEIOUaeiouyAEIOUYaeiou ꓺ ... 🦊 ÂÊÎÔÛãñõÃÑÕäëïöüÿÄËÏÖÜŸçÇßØøÅåÆæœ🦊', /^.*?aeiou.*$/u)).toBe(true);
        expect($str.test('aeiouAEIOUaeiouyAEIOUYaeiou ꓺ ... 🦊 ÂÊÎÔÛãñõÃÑÕäëïöüÿÄËÏÖÜŸçÇßØøÅåÆæœ🦊', /^.*?a(x|e)iou.*$/u)).toBe(true);
        expect($str.test('aeiouAEIOUaeiouyAEIOUYaeiou ꓺ ... 🦊 ÂÊÎÔÛãñõÃÑÕäëïöüÿÄËÏÖÜŸçÇßØøÅåÆæœ🦊', /^.*?çÇßØøÅåÆæœ🦊$/u)).toBe(true);
        expect($str.test('aeiouAEIOUaeiouyAEIOUYaeiou ꓺ ... 🦊 ÂÊÎÔÛãñõÃÑÕäëïöüÿÄËÏÖÜŸçÇßØøÅåÆæœ🦊', /^.*?ꓺ.*$/u)).toBe(true);
        expect($str.test('aeiouAEIOUaeiouyAEIOUYaeiou ꓺ ... 🦊 ÂÊÎÔÛãñõÃÑÕäëïöüÿÄËÏÖÜŸçÇßØøÅåÆæœ🦊', /^.*?🦊$/u)).toBe(true);
        expect($str.test('aeiouAEIOUaeiouyAEIOUYaeiou ꓺ ... 🦊 ÂÊÎÔÛãñõÃÑÕäëïöüÿÄËÏÖÜŸçÇßØøÅåÆæœ🦊', /^.*? ꓺ ... 🦊 .*$/u)).toBe(true);

        expect($str.test('aeiouAEIOUaeiouyAEIOUYaeiou ꓺ ... 🦊 ÂÊÎÔÛãñõÃÑÕäëïöüÿÄËÏÖÜŸçÇßØøÅåÆæœ', /^ $/u)).toBe(false);
        expect($str.test('aeiouAEIOUaeiouyAEIOUYaeiou ꓺ ... 🦊 ÂÊÎÔÛãñõÃÑÕäëïöüÿÄËÏÖÜŸçÇßØøÅåÆæœ', /^ .*$/u)).toBe(false);
        expect($str.test('aeiouAEIOUaeiouyAEIOUYaeiou ꓺ ... 🦊 ÂÊÎÔÛãñõÃÑÕäëïöüÿÄËÏÖÜŸçÇßØøÅåÆæœ', /^.*?x.*$/u)).toBe(false);
        expect($str.test('aeiouAEIOUaeiouyAEIOUYaeiou ꓺ ... 🦊 ÂÊÎÔÛãñõÃÑÕäëïöüÿÄËÏÖÜŸçÇßØøÅåÆæœ', /^.*?a(x|z)iou.*$/u)).toBe(false);
        expect($str.test('aeiouAEIOUaeiouyAEIOUYaeiou ꓺ ... 🦊 ÂÊÎÔÛãñõÃÑÕäëïöüÿÄËÏÖÜŸçÇßØøÅåÆæœ', /^.*?🦊🦊🦊🦊🦊🦊🦊.*$/u)).toBe(false);
    });
    test('.hasAsianChars()', async () => {
        /**
         * Chinese:
         *
         * - 你 (nǐ) - "you"
         * - 好 (hǎo) - "good"
         * - 中国 (Zhōngguó) - "China"
         * - 人 (rén) - "person"
         * - 中文 (zhōngwén) - "Chinese language"
         */
        expect($str.hasAsianChars('你')).toBe(true);
        expect($str.hasAsianChars('好')).toBe(true);
        expect($str.hasAsianChars('中国')).toBe(true);
        expect($str.hasAsianChars('人')).toBe(true);
        expect($str.hasAsianChars('中文')).toBe(true);

        /**
         * Japanese:
         *
         * - あ (a) - Hiragana character.
         * - い (i) - Hiragana character.
         * - こんにちは (konnichiwa) - "hello"
         * - 日本 (Nihon) - "Japan"
         * - ありがとう (arigatou) - "thank you"
         */
        expect($str.hasAsianChars('あ')).toBe(true);
        expect($str.hasAsianChars('い')).toBe(true);
        expect($str.hasAsianChars('こんにちは')).toBe(true);
        expect($str.hasAsianChars('日本')).toBe(true);
        expect($str.hasAsianChars('ありがとう')).toBe(true);

        /**
         * Korean:
         *
         * - 안녕하세요 (annyeonghaseyo) - "hello"
         * - 한국 (hanguk) - "Korea"
         * - 사랑 (sarang) - "love"
         * - 감사합니다 (gamsahamnida) - "thank you"
         * - 안녕 (annyeong) - "goodbye"
         */
        expect($str.hasAsianChars('안녕하세요')).toBe(true);
        expect($str.hasAsianChars('한국')).toBe(true);
        expect($str.hasAsianChars('사랑')).toBe(true);
        expect($str.hasAsianChars('감사합니다')).toBe(true);
        expect($str.hasAsianChars('안녕')).toBe(true);

        /**
         * Other Asian characters:
         *
         * - อักษรไทย (akson thai) - "Thai alphabet"
         * - ਪੰਜਾਬੀ (Panjabi) - "Punjabi language" (Gurmukhi script)
         * - தமிழ் (Tamiḻ) - "Tamil language" (Tamil script)
         * - हिन्दी (Hindī) - "Hindi language" (Devanagari script)
         * - བོད་སྐད (bod skad) - "Tibetan language" (Tibetan script)
         */
        expect($str.hasAsianChars('อักษรไทย')).toBe(true);
        expect($str.hasAsianChars('ਪੰਜਾਬੀ')).toBe(true);
        expect($str.hasAsianChars('தமிழ்')).toBe(true);
        expect($str.hasAsianChars('हिन्दी')).toBe(true);
        expect($str.hasAsianChars('བོད་སྐད')).toBe(true);

        /**
         * Other non-asian characters:
         */
        expect($str.hasAsianChars('aeiouAEIOUaeiouyAEIOUYaeiou ... 🦊 ÂÊÎÔÛãñõÃÑÕäëïöüÿÄËÏÖÜŸçÇßØøÅåÆæœ🦊')).toBe(false);

        /**
         * Notably, our double-dot character is an asian character.
         */
        expect($str.hasAsianChars('ꓺ')).toBe(true);
    });
});

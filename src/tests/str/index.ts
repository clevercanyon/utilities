/**
 * Test suite.
 */

import { describe, expect, test } from 'vitest';
import { $is, $str } from '../../index.ts';

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
        expect($str.numeronym('hop')).toBe('h1p');
        expect($str.numeronym('clevercanyon')).toBe('c10n');
        expect($str.numeronym('heļlṏ, ꓺ ... 🦊 wɵrḻɖ!')).toBe('h6l');
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
        expect($str.clip('🦊øÅåabcdefg', { maxBytes: 9 })).toBe('🦊[…]');
        expect($str.clip('abcdefg🦊øÅå', { maxBytes: 10 })).toBe('abcde[…]');

        expect($str.byteLength($str.clip('🦊øÅåabcdefg', { maxBytes: 9 }))).toBe(9);
        expect($str.byteLength($str.clip('abcdefg🦊øÅå', { maxBytes: 10 }))).toBe(10);

        expect($str.clip('🦊øÅåabcdefg', { maxChars: 10 })).toBe('🦊øÅåabc[…]');
        expect($str.clip('abcdefg🦊øÅå', { maxChars: 10 })).toBe('abcdefg[…]');

        expect($str.charLength($str.clip('🦊øÅåabcdefg', { maxChars: 10 }))).toBe(10);
        expect($str.charLength($str.clip('abcdefg🦊øÅå', { maxChars: 10 }))).toBe(10);
    });
    test('.splitWords()', async () => {
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
        expect($str.lowerFirst('Heļlṏ, ꓺ ... 🦊 wɵrḻɖ!')).toBe('heļlṏ, ꓺ ... 🦊 wɵrḻɖ!');
        expect($str.lowerFirst('[heļlṏ, ꓺ ... 🦊 wɵrḻɖ!]')).toBe('[heļlṏ, ꓺ ... 🦊 wɵrḻɖ!]');
        expect($str.lowerFirst('Foo-bar-bazBiz-PascalCase-snake_case-kebab-case')).toBe('foo-bar-bazBiz-PascalCase-snake_case-kebab-case');
        expect($str.lowerFirst('Foo bar bazBiz PascalCase snake_case kebab-case')).toBe('foo bar bazBiz PascalCase snake_case kebab-case');
        expect($str.lowerFirst('AeiouAEIOUaeiouyAEIOUYaeiouAEIOUanoANOaeiouyAEIOUYçÇßØøÅåÆæœ')).toBe('aeiouAEIOUaeiouyAEIOUYaeiouAEIOUanoANOaeiouyAEIOUYçÇßØøÅåÆæœ');
        expect($str.lowerFirst('àèìòùÀÈÌÒÙáéíóúýÁÉÍÓÚÝâêîôûÂÊÎÔÛãñõÃÑÕäëïöüÿÄËÏÖÜŸçÇßØøÅåÆæœ')).toBe('àèìòùÀÈÌÒÙáéíóúýÁÉÍÓÚÝâêîôûÂÊÎÔÛãñõÃÑÕäëïöüÿÄËÏÖÜŸçÇßØøÅåÆæœ');
        expect($str.lowerFirst('ÀÈÌÒÙàèìòùáéíóúýÁÉÍÓÚÝâêîôûÂÊÎÔÛãñõÃÑÕäëïöüÿÄËÏÖÜŸçÇßØøÅåÆæœ')).toBe('àÈÌÒÙàèìòùáéíóúýÁÉÍÓÚÝâêîôûÂÊÎÔÛãñõÃÑÕäëïöüÿÄËÏÖÜŸçÇßØøÅåÆæœ');
    });
    test('.upperFirst()', async () => {
        expect($str.upperFirst('heļlṏ, ꓺ ... 🦊 wɵrḻɖ!')).toBe('Heļlṏ, ꓺ ... 🦊 wɵrḻɖ!');
        expect($str.upperFirst('[heļlṏ, ꓺ ... 🦊 wɵrḻɖ!]')).toBe('[heļlṏ, ꓺ ... 🦊 wɵrḻɖ!]');
        expect($str.upperFirst('Foo-bar-bazBiz-PascalCase-snake_case-kebab-case')).toBe('Foo-bar-bazBiz-PascalCase-snake_case-kebab-case');
        expect($str.upperFirst('Foo bar bazBiz PascalCase snake_case kebab-case')).toBe('Foo bar bazBiz PascalCase snake_case kebab-case');
        expect($str.upperFirst('aeiouAEIOUaeiouyAEIOUYaeiouAEIOUanoANOaeiouyAEIOUYçÇßØøÅåÆæœ')).toBe('AeiouAEIOUaeiouyAEIOUYaeiouAEIOUanoANOaeiouyAEIOUYçÇßØøÅåÆæœ');
        expect($str.upperFirst('àèìòùÀÈÌÒÙáéíóúýÁÉÍÓÚÝâêîôûÂÊÎÔÛãñõÃÑÕäëïöüÿÄËÏÖÜŸçÇßØøÅåÆæœ')).toBe('ÀèìòùÀÈÌÒÙáéíóúýÁÉÍÓÚÝâêîôûÂÊÎÔÛãñõÃÑÕäëïöüÿÄËÏÖÜŸçÇßØøÅåÆæœ');
        expect($str.upperFirst('ÀÈÌÒÙàèìòùáéíóúýÁÉÍÓÚÝâêîôûÂÊÎÔÛãñõÃÑÕäëïöüÿÄËÏÖÜŸçÇßØøÅåÆæœ')).toBe('ÀÈÌÒÙàèìòùáéíóúýÁÉÍÓÚÝâêîôûÂÊÎÔÛãñõÃÑÕäëïöüÿÄËÏÖÜŸçÇßØøÅåÆæœ');
    });
    test('.capitalize()', async () => {
        expect($str.capitalize('heļlṏ, ꓺ ... 🦊 wɵrḻɖ!')).toBe('Heļlṏ, ꓺ ... 🦊 wɵrḻɖ!');
        expect($str.capitalize('[heļlṏ, ꓺ ... 🦊 wɵrḻɖ!]')).toBe('[heļlṏ, ꓺ ... 🦊 wɵrḻɖ!]');
        expect($str.capitalize('Foo-bar-bazBiz-PascalCase-snake_case-kebab-case')).toBe('Foo-bar-bazbiz-pascalcase-snake_case-kebab-case');
        expect($str.capitalize('Foo bar bazBiz PascalCase snake_case kebab-case')).toBe('Foo bar bazbiz pascalcase snake_case kebab-case');
        expect($str.capitalize('aeiouAEIOUaeiouyAEIOUYaeiouAEIOUanoANOaeiouyAEIOUYçÇßØøÅåÆæœ')).toBe('Aeiouaeiouaeiouyaeiouyaeiouaeiouanoanoaeiouyaeiouyççßøøååææœ');
        expect($str.capitalize('àèìòùÀÈÌÒÙáéíóúýÁÉÍÓÚÝâêîôûÂÊÎÔÛãñõÃÑÕäëïöüÿÄËÏÖÜŸçÇßØøÅåÆæœ')).toBe('Àèìòùàèìòùáéíóúýáéíóúýâêîôûâêîôûãñõãñõäëïöüÿäëïöüÿççßøøååææœ');
        expect($str.capitalize('ÀÈÌÒÙàèìòùáéíóúýÁÉÍÓÚÝâêîôûÂÊÎÔÛãñõÃÑÕäëïöüÿÄËÏÖÜŸçÇßØøÅåÆæœ')).toBe('Àèìòùàèìòùáéíóúýáéíóúýâêîôûâêîôûãñõãñõäëïöüÿäëïöüÿççßøøååææœ');
    });
    test('.titleCase()', async () => {
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
            .toBe('&lt;foo&gt; &amp; &lt;&quot;aeiouAEIOUaeiouyAEIOUYaeiouÂÊÎÔÛãñõÃÑÕäëïöüÿÄËÏÖÜŸçÇßØøÅåÆæœ&#39;&gt;');

        expect($str.escHTML('<foo> & &amp; <"heļlṏ, ꓺ ... 🦊 wɵrḻɖ!\'>')).toBe('&lt;foo&gt; &amp; &amp; &lt;&quot;heļlṏ, ꓺ ... 🦊 wɵrḻɖ!&#39;&gt;');
        expect($str.escHTML('<foo> & &amp; <"heļlṏ, ꓺ ... 🦊 wɵrḻɖ!\'>', { doubleEncode: true })).toBe('&lt;foo&gt; &amp; &amp;amp; &lt;&quot;heļlṏ, ꓺ ... 🦊 wɵrḻɖ!&#39;&gt;');
    });
    test('.unescHTML()', async () => {
        expect($str.unescHTML('&lt;foo&gt; &amp; &lt;&quot;aeiouAEIOUaeiouyAEIOUYaeiouÂÊÎÔÛãñõÃÑÕäëïöüÿÄËÏÖÜŸçÇßØøÅåÆæœ&#39;&gt;')) //
            .toBe('<foo> & <"aeiouAEIOUaeiouyAEIOUYaeiouÂÊÎÔÛãñõÃÑÕäëïöüÿÄËÏÖÜŸçÇßØøÅåÆæœ\'>');

        expect($str.unescHTML('&lt;foo&gt; &amp; &amp; &lt;&quot;heļlṏ, ꓺ ... 🦊 wɵrḻɖ!&#39;&gt;')).toBe('<foo> & & <"heļlṏ, ꓺ ... 🦊 wɵrḻɖ!\'>');
        expect($str.unescHTML('&lt;foo&gt; &amp; &amp;amp; &lt;&quot;heļlṏ, ꓺ ... 🦊 wɵrḻɖ!&#39;&gt;')).toBe('<foo> & &amp; <"heļlṏ, ꓺ ... 🦊 wɵrḻɖ!\'>');
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
});

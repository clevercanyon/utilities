/**
 * Test suite.
 */

import { $crypto } from '#index.ts';
import { describe, expect, test } from 'vitest';

describe('$crypto', async () => {
    test('.sha1()', async () => {
        expect((await $crypto.sha1('')).length).toBe(40);
        expect(await $crypto.sha1('')).toBe('da39a3ee5e6b4b0d3255bfef95601890afd80709');

        expect((await $crypto.sha1('abc')).length).toBe(40);
        expect(await $crypto.sha1('abc')).toBe('a9993e364706816aba3e25717850c26c9cd0d89d');

        expect(await $crypto.sha1('def')).toBe('589c22335a381f122d129225f5c0ba3056ed5811');
        expect(await $crypto.sha1('ghi')).toBe('481743d632b80d39bc2771d19be3ca3005b3f8af');
    });
    test('.hmacSHA1()', async () => {
        expect((await $crypto.hmacSHA1('', '\0')).length).toBe(40);
        expect(await $crypto.hmacSHA1('', '\0')).toBe('fbdb1d1b18aa6c08324b7d64b71fb76370690e1d');

        expect((await $crypto.hmacSHA1('abc', 'def')).length).toBe(40);
        expect(await $crypto.hmacSHA1('abc', 'def')).toBe('7584ee14493072cd8d9ae850e0ff090538230f8c');

        expect(await $crypto.hmacSHA1('def', 'ghi')).toBe('847be85b105b36fdcee407adc4bb19a0918375e3');
        expect(await $crypto.hmacSHA1('jkl', 'mno')).toBe('b00a80d0b715b49b5175e877b3017529f3733add');
    });
    test('.sha256()', async () => {
        expect((await $crypto.sha256('')).length).toBe(64);
        expect(await $crypto.sha256('')).toBe('e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855');

        expect((await $crypto.sha256('abc')).length).toBe(64);
        expect(await $crypto.sha256('abc')).toBe('ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad');

        expect(await $crypto.sha256('def')).toBe('cb8379ac2098aa165029e3938a51da0bcecfc008fd6795f401178647f96c5b34');
        expect(await $crypto.sha256('ghi')).toBe('50ae61e841fac4e8f9e40baf2ad36ec868922ea48368c18f9535e47db56dd7fb');
    });
    test('.hmacSHA256()', async () => {
        expect((await $crypto.hmacSHA256('', '\0')).length).toBe(64);
        expect(await $crypto.hmacSHA256('', '\0')).toBe('b613679a0814d9ec772f95d778c35fc5ff1697c493715653c6c712144292c5ad');

        expect((await $crypto.hmacSHA256('abc', 'def')).length).toBe(64);
        expect(await $crypto.hmacSHA256('abc', 'def')).toBe('397f467341e4d78c474867ef3261cdb46c0e10351e9a989963e6cb2dce40ee5d');

        expect(await $crypto.hmacSHA256('def', 'ghi')).toBe('08938c5bf9909bd400090b526a24add2c13c2a4e347e081416acd1d9e5570197');
        expect(await $crypto.hmacSHA256('jkl', 'mno')).toBe('58662efdecc80aec78edc1fe30f313ccbb4cfbce86e9637c3cfd24b1ffe81506');
    });
    test('.sha384()', async () => {
        expect((await $crypto.sha384('')).length).toBe(96);
        expect(await $crypto.sha384('')).toBe('38b060a751ac96384cd9327eb1b1e36a21fdb71114be07434c0cc7bf63f6e1da274edebfe76f65fbd51ad2f14898b95b');

        expect((await $crypto.sha384('abc')).length).toBe(96);
        expect(await $crypto.sha384('abc')).toBe('cb00753f45a35e8bb5a03d699ac65007272c32ab0eded1631a8b605a43ff5bed8086072ba1e7cc2358baeca134c825a7');

        expect(await $crypto.sha384('def')).toBe('180c325cccb299e76ec6c03a5b5a7755af8ef499906dbf531f18d0ca509e4871b0805cac0f122b962d54badc6119f3cf');
        expect(await $crypto.sha384('ghi')).toBe('1ad66ef0418b7e24de0bf2db0c46e700bd8a705efd781a477f5663561970f418f85a159ead0a6de87f17eba03cb7f542');
    });
    test('.hmacSHA384()', async () => {
        expect((await $crypto.hmacSHA384('', '\0')).length).toBe(96);
        expect(await $crypto.hmacSHA384('', '\0')).toBe('6c1f2ee938fad2e24bd91298474382ca218c75db3d83e114b3d4367776d14d3551289e75e8209cd4b792302840234adc');

        expect((await $crypto.hmacSHA384('abc', 'def')).length).toBe(96);
        expect(await $crypto.hmacSHA384('abc', 'def')).toBe('43e1d040a32182a0a4df43e7d95eb8c4a104fed3dd4d0fd39944e522626da148b2a7ac3926b8e4bb78892ec497bf2955');

        expect(await $crypto.hmacSHA384('def', 'ghi')).toBe('fd2180d7ef3b9f4cdacf68e29a8cadda1c547c6e6231fb1af7c819ebab743c0dab811c9a10574d3246dd8270e2f6a4f5');
        expect(await $crypto.hmacSHA384('jkl', 'mno')).toBe('3bd67771180e5e280930f4a888bfd4577f3a2a011782a0d036fd863b771c5e535f903d346b37625d7ad917669a1582ef');
    });
    test('.sha512()', async () => {
        expect((await $crypto.sha512('')).length).toBe(128);
        expect(await $crypto.sha512('')).toBe('cf83e1357eefb8bdf1542850d66d8007d620e4050b5715dc83f4a921d36ce9ce47d0d13c5d85f2b0ff8318d2877eec2f63b931bd47417a81a538327af927da3e');

        expect((await $crypto.sha512('abc')).length).toBe(128);
        expect(await $crypto.sha512('abc')).toBe(
            'ddaf35a193617abacc417349ae20413112e6fa4e89a97ea20a9eeee64b55d39a2192992a274fc1a836ba3c23a3feebbd454d4423643ce80e2a9ac94fa54ca49f',
        );
        expect(await $crypto.sha512('def')).toBe(
            '40a855bf0a93c1019d75dd5b59cd8157608811dd75c5977e07f3bc4be0cad98b22dde4db9ddb429fc2ad3cf9ca379fedf6c1dc4d4bb8829f10c2f0ee04a66663',
        );
        expect(await $crypto.sha512('ghi')).toBe(
            '366aead3bed29b6d1de2b8d211e791e5dc7a9611b3d4c61c9323128d746e670a69e9690ce5620efc3b36f6d1b655ce36a72a2fbed4927448b668f1e3f341c0d9',
        );
    });
    test('.hmacSHA512()', async () => {
        expect((await $crypto.hmacSHA512('', '\0')).length).toBe(128);
        expect(await $crypto.hmacSHA512('', '\0')).toBe(
            'b936cee86c9f87aa5d3c6f2e84cb5a4239a5fe50480a6ec66b70ab5b1f4ac6730c6c515421b327ec1d69402e53dfb49ad7381eb067b338fd7b0cb22247225d47',
        );
        expect((await $crypto.hmacSHA512('abc', 'def')).length).toBe(128);
        expect(await $crypto.hmacSHA512('abc', 'def')).toBe(
            '17111e70f32d48a37ccc50a21deb12b40dfe223abf5ac852428000182125dab8a12ee95dd9f526bfb79c1a4fe00a4118e3b525f40eb8291325e3030f2e13ad34',
        );
        expect(await $crypto.hmacSHA512('def', 'ghi')).toBe(
            '4ad7f68e77da50318b34acdafd5cc8d20ccce84446efc4a4ce5c653aeb89c5c8f34ac2a157f5a453044353e91a8e7500e828cb06451cbf2de91668f8b78a0008',
        );
        expect(await $crypto.hmacSHA512('jkl', 'mno')).toBe(
            '174cef475e623a06cd0426172e51ca241b4b200ca70638809bd28e9e8ea2fc149eb46d78719fb43cb7f4291bbd2a10e0f9f5b7a93c2e250d2c5f2dee31601d32',
        );
    });
    test('.randomNumber()', async () => {
        expect(typeof $crypto.randomNumber()).toBe('number');
        expect(typeof $crypto.randomNumber(0, 1)).toBe('number');
        expect(typeof $crypto.randomNumber(0, Number.MAX_SAFE_INTEGER)).toBe('number');
    });
    test('.randomString()', async () => {
        expect($crypto.randomString().length).toBe(32);
        expect($crypto.randomString(128).length).toBe(128);
        expect($crypto.randomString(96).length).toBe(96);
        expect($crypto.randomString(64).length).toBe(64);
        expect($crypto.randomString(32).length).toBe(32);
        expect($crypto.randomString(24).length).toBe(24);
        expect($crypto.randomString(12).length).toBe(12);
        expect($crypto.randomString(8).length).toBe(8);
        expect($crypto.randomString(1).length).toBe(1);
        expect($crypto.randomString(0).length).toBe(0);

        expect(/^[abcdefghjkmnpqrstuvwxyzABCDEFGHJKMNPQRSTUVWXYZ]{32}$/u.test($crypto.randomString(32, { type: 'alphabetic' }))).toBe(true);
        expect(/^[abcdefghjkmnpqrstuvwxyz]{32}$/u.test($crypto.randomString(32, { type: 'lower-alphabetic' }))).toBe(true);
        expect(/^[ABCDEFGHJKMNPQRSTUVWXYZ]{32}$/u.test($crypto.randomString(32, { type: 'upper-alphabetic' }))).toBe(true);

        expect(/^[23456789abcdefghjkmnpqrstuvwxyzABCDEFGHJKMNPQRSTUVWXYZ]{32}$/u.test($crypto.randomString(32, { type: 'alphanumeric' }))).toBe(true);
        expect(/^[23456789abcdefghjkmnpqrstuvwxyz]{32}$/u.test($crypto.randomString(32, { type: 'lower-alphanumeric' }))).toBe(true);
        expect(/^[23456789ABCDEFGHJKMNPQRSTUVWXYZ]{32}$/u.test($crypto.randomString(32, { type: 'upper-alphanumeric' }))).toBe(true);

        expect(/^[23456789]{32}$/u.test($crypto.randomString(32, { type: 'numeric' }))).toBe(true);
        expect(
            /^[0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ`~!@#$%^&*+\-=_()[\]{}<>|\\/?.,;:'"]{32}$/u.test($crypto.randomString(32, { type: 'cryptic' })),
        ).toBe(true);
        expect(/^[23456789abcdefghjkmnpqrstuvwxyzABCDEFGHJKMNPQRSTUVWXYZ\-_]{32}$/u.test($crypto.randomString(32, { type: 'url-safe' }))).toBe(true);
        expect(/^[23456789abcdefghjkmnpqrstuvwxyzABCDEFGHJKMNPQRSTUVWXYZ!@#%^&*+\-=_?]{32}$/u.test($crypto.randomString(32, { type: 'default' }))).toBe(true);
        expect(/^[23456789abcdefghjkmnpqrstuvwxyzABCDEFGHJKMNPQRSTUVWXYZ!@#%^&*+\-=_?]{32}$/u.test($crypto.randomString(32))).toBe(true);

        expect(/^[xyz]{32}$/u.test($crypto.randomString(32, { byteDictionary: 'xyz' }))).toBe(true);
        expect(/^[123xyz]{32}$/u.test($crypto.randomString(32, { byteDictionary: '123xyz' }))).toBe(true);
    });
    test('.uuidV4()', async () => {
        const uuidOne = $crypto.uuidV4();
        const uuidTwo = $crypto.uuidV4();
        const uuidThree = $crypto.uuidV4();

        expect(uuidOne).toMatch(/^[a-f0-9]{32}$/u);
        expect(uuidTwo).toMatch(/^[a-f0-9]{32}$/u);
        expect(uuidThree).toMatch(/^[a-f0-9]{32}$/u);

        expect(uuidOne === uuidTwo).toBe(false);
        expect(uuidOne === uuidThree).toBe(false);

        expect(uuidTwo === uuidOne).toBe(false);
        expect(uuidTwo === uuidThree).toBe(false);

        expect(uuidThree === uuidOne).toBe(false);
        expect(uuidThree === uuidTwo).toBe(false);
    });
    test('.uuidV4({ dashes: true })', async () => {
        const uuidOne = $crypto.uuidV4({ dashes: true });
        const uuidTwo = $crypto.uuidV4({ dashes: true });
        const uuidThree = $crypto.uuidV4({ dashes: true });

        expect(uuidOne).toMatch(/^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/u);
        expect(uuidTwo).toMatch(/^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/u);
        expect(uuidThree).toMatch(/^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/u);

        expect(uuidOne === uuidTwo).toBe(false);
        expect(uuidOne === uuidThree).toBe(false);

        expect(uuidTwo === uuidOne).toBe(false);
        expect(uuidTwo === uuidThree).toBe(false);

        expect(uuidThree === uuidOne).toBe(false);
        expect(uuidThree === uuidTwo).toBe(false);
    });
    test('.safeEqual()', async () => {
        expect($crypto.safeEqual('a', 'a')).toBe(true);
        expect($crypto.safeEqual('a', 'b')).toBe(false);
    });
    test('.base64Encode()', async () => {
        expect($crypto.base64Encode('aeiouAEIOUaeiouyAEIOUYaeiouAEIOUanoANOaeiouyAEIOUYçÇßØøÅåÆæœ')).toBe(
            'YWVpb3VBRUlPVWFlaW91eUFFSU9VWWFlaW91QUVJT1Vhbm9BTk9hZWlvdXlBRUlPVVnDp8OHw5/DmMO4w4XDpcOGw6bFkw==',
        );
        expect($crypto.base64Encode('aeiouAEIOUaeiouyAEIOUYaeiouAEIOUanoANOaeiouyAEIOUYçÇßØøÅåÆæœ', { urlSafe: true })).toBe(
            'YWVpb3VBRUlPVWFlaW91eUFFSU9VWWFlaW91QUVJT1Vhbm9BTk9hZWlvdXlBRUlPVVnDp8OHw5_DmMO4w4XDpcOGw6bFkw',
        );
    });
    test('.base64Decode()', async () => {
        expect($crypto.base64Decode('YWVpb3VBRUlPVWFlaW91eUFFSU9VWWFlaW91QUVJT1Vhbm9BTk9hZWlvdXlBRUlPVVnDp8OHw5/DmMO4w4XDpcOGw6bFkw==')).toBe(
            'aeiouAEIOUaeiouyAEIOUYaeiouAEIOUanoANOaeiouyAEIOUYçÇßØøÅåÆæœ',
        );
        expect($crypto.base64Decode('YWVpb3VBRUlPVWFlaW91eUFFSU9VWWFlaW91QUVJT1Vhbm9BTk9hZWlvdXlBRUlPVVnDp8OHw5_DmMO4w4XDpcOGw6bFkw', { urlSafe: true })).toBe(
            'aeiouAEIOUaeiouyAEIOUYaeiouAEIOUanoANOaeiouyAEIOUYçÇßØøÅåÆæœ',
        );
    });
    test('.base64DecodeToBlob()', async () => {
        expect($crypto.base64DecodeToBlob('YWVpb3VBRUlPVWFlaW91eUFFSU9VWWFlaW91QUVJT1Vhbm9BTk9hZWlvdXlBRUlPVVnDp8OHw5/DmMO4w4XDpcOGw6bFkw==').size).toBe(70);
        expect($crypto.base64DecodeToBlob('YWVpb3VBRUlPVWFlaW91eUFFSU9VWWFlaW91QUVJT1Vhbm9BTk9hZWlvdXlBRUlPVVnDp8OHw5_DmMO4w4XDpcOGw6bFkw', { urlSafe: true }).size).toBe(70);

        expect($crypto.base64DecodeToBlob('YWVpb3VBRUlPVWFlaW91eUFFSU9VWWFlaW91QUVJT1Vhbm9BTk9hZWlvdXlBRUlPVVnDp8OHw5/DmMO4w4XDpcOGw6bFkw==').type).toBe('');
        expect($crypto.base64DecodeToBlob('YWVpb3VBRUlPVWFlaW91eUFFSU9VWWFlaW91QUVJT1Vhbm9BTk9hZWlvdXlBRUlPVVnDp8OHw5/DmMO4w4XDpcOGw6bFkw==', { type: 'text/plain' }).type).toBe(
            'text/plain',
        );
        expect($crypto.base64DecodeToBlob('data:text/plain;base64,YWVpb3VBRUlPVWFlaW91eUFFSU9VWWFlaW91QUVJT1Vhbm9BTk9hZWlvdXlBRUlPVVnDp8OHw5/DmMO4w4XDpcOGw6bFkw==').size).toBe(70);
        expect(
            $crypto.base64DecodeToBlob('data:text/plain;base64,YWVpb3VBRUlPVWFlaW91eUFFSU9VWWFlaW91QUVJT1Vhbm9BTk9hZWlvdXlBRUlPVVnDp8OHw5_DmMO4w4XDpcOGw6bFkw', { urlSafe: true })
                .size,
        ).toBe(70);
        expect($crypto.base64DecodeToBlob('data:text/plain;base64,YWVpb3VBRUlPVWFlaW91eUFFSU9VWWFlaW91QUVJT1Vhbm9BTk9hZWlvdXlBRUlPVVnDp8OHw5/DmMO4w4XDpcOGw6bFkw==').type).toBe(
            'text/plain',
        );
        const svg = `<svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg"><rect width="100%" height="100%" fill="#fff" /><line x1="899" y1="0" x2="899" y2="630" opacity=".75" stroke="#2d7116" stroke-width="50" /><line x1="0" y1="29" x2="1200" y2="29" opacity=".75" stroke="#2d7116" stroke-width="50" /><line x1="406" y1="0" x2="406" y2="630" opacity=".75" stroke="#d71164" stroke-width="22" /><line x1="0" y1="616" x2="1200" y2="616" opacity=".75" stroke="#d71164" stroke-width="22" /><line x1="728" y1="0" x2="728" y2="630" opacity=".75" stroke="#711642" stroke-width="27" /><line x1="0" y1="218" x2="1200" y2="218" opacity=".75" stroke="#711642" stroke-width="27" /><line x1="1048" y1="0" x2="1048" y2="630" opacity=".75" stroke="#11642b" stroke-width="71" /><line x1="0" y1="88" x2="1200" y2="88" opacity=".75" stroke="#11642b" stroke-width="71" /><line x1="408" y1="0" x2="408" y2="630" opacity=".75" stroke="#1642b7" stroke-width="92" /><line x1="0" y1="408" x2="1200" y2="408" opacity=".75" stroke="#1642b7" stroke-width="92" /><line x1="1193" y1="0" x2="1193" y2="630" opacity=".75" stroke="#642b72" stroke-width="43" /><line x1="0" y1="23" x2="1200" y2="23" opacity=".75" stroke="#642b72" stroke-width="43" /><line x1="498" y1="0" x2="498" y2="630" opacity=".75" stroke="#42b726" stroke-width="85" /><line x1="0" y1="18" x2="1200" y2="18" opacity=".75" stroke="#42b726" stroke-width="85" /><line x1="661" y1="0" x2="661" y2="630" opacity=".75" stroke="#2b726b" stroke-width="73" /><line x1="0" y1="31" x2="1200" y2="31" opacity=".75" stroke="#2b726b" stroke-width="73" /><line x1="403" y1="0" x2="403" y2="630" opacity=".75" stroke="#b726b0" stroke-width="50" /><line x1="0" y1="163" x2="1200" y2="163" opacity=".75" stroke="#b726b0" stroke-width="50" /><line x1="1191" y1="0" x2="1191" y2="630" opacity=".75" stroke="#726b04" stroke-width="22" /><line x1="0" y1="81" x2="1200" y2="81" opacity=".75" stroke="#726b04" stroke-width="22" /><line x1="240" y1="0" x2="240" y2="630" opacity=".75" stroke="#26b044" stroke-width="27" /><line x1="0" y1="510" x2="1200" y2="510" opacity=".75" stroke="#26b044" stroke-width="27" /><line x1="313" y1="0" x2="313" y2="630" opacity=".75" stroke="#6b0440" stroke-width="71" /><line x1="0" y1="313" x2="1200" y2="313" opacity=".75" stroke="#6b0440" stroke-width="71" /><line x1="567" y1="0" x2="567" y2="630" opacity=".75" stroke="#b04401" stroke-width="92" /><line x1="0" y1="567" x2="1200" y2="567" opacity=".75" stroke="#b04401" stroke-width="92" /><line x1="1139" y1="0" x2="1139" y2="630" opacity=".75" stroke="#044016" stroke-width="43" /><line x1="0" y1="389" x2="1200" y2="389" opacity=".75" stroke="#044016" stroke-width="43" /><line x1="694" y1="0" x2="694" y2="630" opacity=".75" stroke="#440162" stroke-width="85" /><line x1="0" y1="334" x2="1200" y2="334" opacity=".75" stroke="#440162" stroke-width="85" /><line x1="0" y1="0" x2="0" y2="630" opacity=".75" stroke="#401627" stroke-width="73" /><line x1="0" y1="0" x2="1200" y2="0" opacity=".75" stroke="#401627" stroke-width="73" /><line x1="899" y1="0" x2="899" y2="630" opacity=".75" stroke="#01627c" stroke-width="50" /><line x1="0" y1="29" x2="1200" y2="29" opacity=".75" stroke="#01627c" stroke-width="50" /><line x1="406" y1="0" x2="406" y2="630" opacity=".75" stroke="#1627ca" stroke-width="22" /><line x1="0" y1="616" x2="1200" y2="616" opacity=".75" stroke="#1627ca" stroke-width="22" /><line x1="728" y1="0" x2="728" y2="630" opacity=".75" stroke="#627ca9" stroke-width="27" /><line x1="0" y1="218" x2="1200" y2="218" opacity=".75" stroke="#627ca9" stroke-width="27" /><line x1="1048" y1="0" x2="1048" y2="630" opacity=".75" stroke="#27ca9f" stroke-width="71" /><line x1="0" y1="88" x2="1200" y2="88" opacity=".75" stroke="#27ca9f" stroke-width="71" /><line x1="408" y1="0" x2="408" y2="630" opacity=".75" stroke="#7ca9fb" stroke-width="92" /><line x1="0" y1="408" x2="1200" y2="408" opacity=".75" stroke="#7ca9fb" stroke-width="92" /><line x1="1193" y1="0" x2="1193" y2="630" opacity=".75" stroke="#ca9fba" stroke-width="43" /><line x1="0" y1="23" x2="1200" y2="23" opacity=".75" stroke="#ca9fba" stroke-width="43" /><line x1="498" y1="0" x2="498" y2="630" opacity=".75" stroke="#a9fbac" stroke-width="85" /><line x1="0" y1="18" x2="1200" y2="18" opacity=".75" stroke="#a9fbac" stroke-width="85" /><line x1="661" y1="0" x2="661" y2="630" opacity=".75" stroke="#9fbac3" stroke-width="73" /><line x1="0" y1="31" x2="1200" y2="31" opacity=".75" stroke="#9fbac3" stroke-width="73" /></svg>`;
        const svgBase64 = `PHN2ZyB3aWR0aD0iMTIwMCIgaGVpZ2h0PSI2MzAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0iI2ZmZiIgLz48bGluZSB4MT0iODk5IiB5MT0iMCIgeDI9Ijg5OSIgeTI9IjYzMCIgb3BhY2l0eT0iLjc1IiBzdHJva2U9IiMyZDcxMTYiIHN0cm9rZS13aWR0aD0iNTAiIC8+PGxpbmUgeDE9IjAiIHkxPSIyOSIgeDI9IjEyMDAiIHkyPSIyOSIgb3BhY2l0eT0iLjc1IiBzdHJva2U9IiMyZDcxMTYiIHN0cm9rZS13aWR0aD0iNTAiIC8+PGxpbmUgeDE9IjQwNiIgeTE9IjAiIHgyPSI0MDYiIHkyPSI2MzAiIG9wYWNpdHk9Ii43NSIgc3Ryb2tlPSIjZDcxMTY0IiBzdHJva2Utd2lkdGg9IjIyIiAvPjxsaW5lIHgxPSIwIiB5MT0iNjE2IiB4Mj0iMTIwMCIgeTI9IjYxNiIgb3BhY2l0eT0iLjc1IiBzdHJva2U9IiNkNzExNjQiIHN0cm9rZS13aWR0aD0iMjIiIC8+PGxpbmUgeDE9IjcyOCIgeTE9IjAiIHgyPSI3MjgiIHkyPSI2MzAiIG9wYWNpdHk9Ii43NSIgc3Ryb2tlPSIjNzExNjQyIiBzdHJva2Utd2lkdGg9IjI3IiAvPjxsaW5lIHgxPSIwIiB5MT0iMjE4IiB4Mj0iMTIwMCIgeTI9IjIxOCIgb3BhY2l0eT0iLjc1IiBzdHJva2U9IiM3MTE2NDIiIHN0cm9rZS13aWR0aD0iMjciIC8+PGxpbmUgeDE9IjEwNDgiIHkxPSIwIiB4Mj0iMTA0OCIgeTI9IjYzMCIgb3BhY2l0eT0iLjc1IiBzdHJva2U9IiMxMTY0MmIiIHN0cm9rZS13aWR0aD0iNzEiIC8+PGxpbmUgeDE9IjAiIHkxPSI4OCIgeDI9IjEyMDAiIHkyPSI4OCIgb3BhY2l0eT0iLjc1IiBzdHJva2U9IiMxMTY0MmIiIHN0cm9rZS13aWR0aD0iNzEiIC8+PGxpbmUgeDE9IjQwOCIgeTE9IjAiIHgyPSI0MDgiIHkyPSI2MzAiIG9wYWNpdHk9Ii43NSIgc3Ryb2tlPSIjMTY0MmI3IiBzdHJva2Utd2lkdGg9IjkyIiAvPjxsaW5lIHgxPSIwIiB5MT0iNDA4IiB4Mj0iMTIwMCIgeTI9IjQwOCIgb3BhY2l0eT0iLjc1IiBzdHJva2U9IiMxNjQyYjciIHN0cm9rZS13aWR0aD0iOTIiIC8+PGxpbmUgeDE9IjExOTMiIHkxPSIwIiB4Mj0iMTE5MyIgeTI9IjYzMCIgb3BhY2l0eT0iLjc1IiBzdHJva2U9IiM2NDJiNzIiIHN0cm9rZS13aWR0aD0iNDMiIC8+PGxpbmUgeDE9IjAiIHkxPSIyMyIgeDI9IjEyMDAiIHkyPSIyMyIgb3BhY2l0eT0iLjc1IiBzdHJva2U9IiM2NDJiNzIiIHN0cm9rZS13aWR0aD0iNDMiIC8+PGxpbmUgeDE9IjQ5OCIgeTE9IjAiIHgyPSI0OTgiIHkyPSI2MzAiIG9wYWNpdHk9Ii43NSIgc3Ryb2tlPSIjNDJiNzI2IiBzdHJva2Utd2lkdGg9Ijg1IiAvPjxsaW5lIHgxPSIwIiB5MT0iMTgiIHgyPSIxMjAwIiB5Mj0iMTgiIG9wYWNpdHk9Ii43NSIgc3Ryb2tlPSIjNDJiNzI2IiBzdHJva2Utd2lkdGg9Ijg1IiAvPjxsaW5lIHgxPSI2NjEiIHkxPSIwIiB4Mj0iNjYxIiB5Mj0iNjMwIiBvcGFjaXR5PSIuNzUiIHN0cm9rZT0iIzJiNzI2YiIgc3Ryb2tlLXdpZHRoPSI3MyIgLz48bGluZSB4MT0iMCIgeTE9IjMxIiB4Mj0iMTIwMCIgeTI9IjMxIiBvcGFjaXR5PSIuNzUiIHN0cm9rZT0iIzJiNzI2YiIgc3Ryb2tlLXdpZHRoPSI3MyIgLz48bGluZSB4MT0iNDAzIiB5MT0iMCIgeDI9IjQwMyIgeTI9IjYzMCIgb3BhY2l0eT0iLjc1IiBzdHJva2U9IiNiNzI2YjAiIHN0cm9rZS13aWR0aD0iNTAiIC8+PGxpbmUgeDE9IjAiIHkxPSIxNjMiIHgyPSIxMjAwIiB5Mj0iMTYzIiBvcGFjaXR5PSIuNzUiIHN0cm9rZT0iI2I3MjZiMCIgc3Ryb2tlLXdpZHRoPSI1MCIgLz48bGluZSB4MT0iMTE5MSIgeTE9IjAiIHgyPSIxMTkxIiB5Mj0iNjMwIiBvcGFjaXR5PSIuNzUiIHN0cm9rZT0iIzcyNmIwNCIgc3Ryb2tlLXdpZHRoPSIyMiIgLz48bGluZSB4MT0iMCIgeTE9IjgxIiB4Mj0iMTIwMCIgeTI9IjgxIiBvcGFjaXR5PSIuNzUiIHN0cm9rZT0iIzcyNmIwNCIgc3Ryb2tlLXdpZHRoPSIyMiIgLz48bGluZSB4MT0iMjQwIiB5MT0iMCIgeDI9IjI0MCIgeTI9IjYzMCIgb3BhY2l0eT0iLjc1IiBzdHJva2U9IiMyNmIwNDQiIHN0cm9rZS13aWR0aD0iMjciIC8+PGxpbmUgeDE9IjAiIHkxPSI1MTAiIHgyPSIxMjAwIiB5Mj0iNTEwIiBvcGFjaXR5PSIuNzUiIHN0cm9rZT0iIzI2YjA0NCIgc3Ryb2tlLXdpZHRoPSIyNyIgLz48bGluZSB4MT0iMzEzIiB5MT0iMCIgeDI9IjMxMyIgeTI9IjYzMCIgb3BhY2l0eT0iLjc1IiBzdHJva2U9IiM2YjA0NDAiIHN0cm9rZS13aWR0aD0iNzEiIC8+PGxpbmUgeDE9IjAiIHkxPSIzMTMiIHgyPSIxMjAwIiB5Mj0iMzEzIiBvcGFjaXR5PSIuNzUiIHN0cm9rZT0iIzZiMDQ0MCIgc3Ryb2tlLXdpZHRoPSI3MSIgLz48bGluZSB4MT0iNTY3IiB5MT0iMCIgeDI9IjU2NyIgeTI9IjYzMCIgb3BhY2l0eT0iLjc1IiBzdHJva2U9IiNiMDQ0MDEiIHN0cm9rZS13aWR0aD0iOTIiIC8+PGxpbmUgeDE9IjAiIHkxPSI1NjciIHgyPSIxMjAwIiB5Mj0iNTY3IiBvcGFjaXR5PSIuNzUiIHN0cm9rZT0iI2IwNDQwMSIgc3Ryb2tlLXdpZHRoPSI5MiIgLz48bGluZSB4MT0iMTEzOSIgeTE9IjAiIHgyPSIxMTM5IiB5Mj0iNjMwIiBvcGFjaXR5PSIuNzUiIHN0cm9rZT0iIzA0NDAxNiIgc3Ryb2tlLXdpZHRoPSI0MyIgLz48bGluZSB4MT0iMCIgeTE9IjM4OSIgeDI9IjEyMDAiIHkyPSIzODkiIG9wYWNpdHk9Ii43NSIgc3Ryb2tlPSIjMDQ0MDE2IiBzdHJva2Utd2lkdGg9IjQzIiAvPjxsaW5lIHgxPSI2OTQiIHkxPSIwIiB4Mj0iNjk0IiB5Mj0iNjMwIiBvcGFjaXR5PSIuNzUiIHN0cm9rZT0iIzQ0MDE2MiIgc3Ryb2tlLXdpZHRoPSI4NSIgLz48bGluZSB4MT0iMCIgeTE9IjMzNCIgeDI9IjEyMDAiIHkyPSIzMzQiIG9wYWNpdHk9Ii43NSIgc3Ryb2tlPSIjNDQwMTYyIiBzdHJva2Utd2lkdGg9Ijg1IiAvPjxsaW5lIHgxPSIwIiB5MT0iMCIgeDI9IjAiIHkyPSI2MzAiIG9wYWNpdHk9Ii43NSIgc3Ryb2tlPSIjNDAxNjI3IiBzdHJva2Utd2lkdGg9IjczIiAvPjxsaW5lIHgxPSIwIiB5MT0iMCIgeDI9IjEyMDAiIHkyPSIwIiBvcGFjaXR5PSIuNzUiIHN0cm9rZT0iIzQwMTYyNyIgc3Ryb2tlLXdpZHRoPSI3MyIgLz48bGluZSB4MT0iODk5IiB5MT0iMCIgeDI9Ijg5OSIgeTI9IjYzMCIgb3BhY2l0eT0iLjc1IiBzdHJva2U9IiMwMTYyN2MiIHN0cm9rZS13aWR0aD0iNTAiIC8+PGxpbmUgeDE9IjAiIHkxPSIyOSIgeDI9IjEyMDAiIHkyPSIyOSIgb3BhY2l0eT0iLjc1IiBzdHJva2U9IiMwMTYyN2MiIHN0cm9rZS13aWR0aD0iNTAiIC8+PGxpbmUgeDE9IjQwNiIgeTE9IjAiIHgyPSI0MDYiIHkyPSI2MzAiIG9wYWNpdHk9Ii43NSIgc3Ryb2tlPSIjMTYyN2NhIiBzdHJva2Utd2lkdGg9IjIyIiAvPjxsaW5lIHgxPSIwIiB5MT0iNjE2IiB4Mj0iMTIwMCIgeTI9IjYxNiIgb3BhY2l0eT0iLjc1IiBzdHJva2U9IiMxNjI3Y2EiIHN0cm9rZS13aWR0aD0iMjIiIC8+PGxpbmUgeDE9IjcyOCIgeTE9IjAiIHgyPSI3MjgiIHkyPSI2MzAiIG9wYWNpdHk9Ii43NSIgc3Ryb2tlPSIjNjI3Y2E5IiBzdHJva2Utd2lkdGg9IjI3IiAvPjxsaW5lIHgxPSIwIiB5MT0iMjE4IiB4Mj0iMTIwMCIgeTI9IjIxOCIgb3BhY2l0eT0iLjc1IiBzdHJva2U9IiM2MjdjYTkiIHN0cm9rZS13aWR0aD0iMjciIC8+PGxpbmUgeDE9IjEwNDgiIHkxPSIwIiB4Mj0iMTA0OCIgeTI9IjYzMCIgb3BhY2l0eT0iLjc1IiBzdHJva2U9IiMyN2NhOWYiIHN0cm9rZS13aWR0aD0iNzEiIC8+PGxpbmUgeDE9IjAiIHkxPSI4OCIgeDI9IjEyMDAiIHkyPSI4OCIgb3BhY2l0eT0iLjc1IiBzdHJva2U9IiMyN2NhOWYiIHN0cm9rZS13aWR0aD0iNzEiIC8+PGxpbmUgeDE9IjQwOCIgeTE9IjAiIHgyPSI0MDgiIHkyPSI2MzAiIG9wYWNpdHk9Ii43NSIgc3Ryb2tlPSIjN2NhOWZiIiBzdHJva2Utd2lkdGg9IjkyIiAvPjxsaW5lIHgxPSIwIiB5MT0iNDA4IiB4Mj0iMTIwMCIgeTI9IjQwOCIgb3BhY2l0eT0iLjc1IiBzdHJva2U9IiM3Y2E5ZmIiIHN0cm9rZS13aWR0aD0iOTIiIC8+PGxpbmUgeDE9IjExOTMiIHkxPSIwIiB4Mj0iMTE5MyIgeTI9IjYzMCIgb3BhY2l0eT0iLjc1IiBzdHJva2U9IiNjYTlmYmEiIHN0cm9rZS13aWR0aD0iNDMiIC8+PGxpbmUgeDE9IjAiIHkxPSIyMyIgeDI9IjEyMDAiIHkyPSIyMyIgb3BhY2l0eT0iLjc1IiBzdHJva2U9IiNjYTlmYmEiIHN0cm9rZS13aWR0aD0iNDMiIC8+PGxpbmUgeDE9IjQ5OCIgeTE9IjAiIHgyPSI0OTgiIHkyPSI2MzAiIG9wYWNpdHk9Ii43NSIgc3Ryb2tlPSIjYTlmYmFjIiBzdHJva2Utd2lkdGg9Ijg1IiAvPjxsaW5lIHgxPSIwIiB5MT0iMTgiIHgyPSIxMjAwIiB5Mj0iMTgiIG9wYWNpdHk9Ii43NSIgc3Ryb2tlPSIjYTlmYmFjIiBzdHJva2Utd2lkdGg9Ijg1IiAvPjxsaW5lIHgxPSI2NjEiIHkxPSIwIiB4Mj0iNjYxIiB5Mj0iNjMwIiBvcGFjaXR5PSIuNzUiIHN0cm9rZT0iIzlmYmFjMyIgc3Ryb2tlLXdpZHRoPSI3MyIgLz48bGluZSB4MT0iMCIgeTE9IjMxIiB4Mj0iMTIwMCIgeTI9IjMxIiBvcGFjaXR5PSIuNzUiIHN0cm9rZT0iIzlmYmFjMyIgc3Ryb2tlLXdpZHRoPSI3MyIgLz48L3N2Zz4=`;

        expect($crypto.base64Encode(svg)).toBe(svgBase64);
        expect($crypto.base64Decode(svgBase64)).toBe(svg);
        expect($crypto.base64DecodeToBlob('data:image/svg+xml;base64,' + $crypto.base64Encode(svg)).type).toBe('image/svg+xml');
    });
});

/**
 * Test suite.
 */

import { $crypto } from '../index.js';
import { describe, test, expect } from 'vitest';

describe('$crypto tests', async () => {
	test('$crypto.sha1()', async () => {
		expect((await $crypto.sha1('')).length).toBe(40);
		expect(await $crypto.sha1('')).toBe('da39a3ee5e6b4b0d3255bfef95601890afd80709');

		expect((await $crypto.sha1('abc')).length).toBe(40);
		expect(await $crypto.sha1('abc')).toBe('a9993e364706816aba3e25717850c26c9cd0d89d');

		expect(await $crypto.sha1('def')).toBe('589c22335a381f122d129225f5c0ba3056ed5811');
		expect(await $crypto.sha1('ghi')).toBe('481743d632b80d39bc2771d19be3ca3005b3f8af');
	});
	test('$crypto.hmacSHA1()', async () => {
		expect((await $crypto.hmacSHA1('', '')).length).toBe(40);
		expect(await $crypto.hmacSHA1('', '')).toBe('fbdb1d1b18aa6c08324b7d64b71fb76370690e1d');

		expect((await $crypto.hmacSHA1('abc', 'def')).length).toBe(40);
		expect(await $crypto.hmacSHA1('abc', 'def')).toBe('7584ee14493072cd8d9ae850e0ff090538230f8c');

		expect(await $crypto.hmacSHA1('def', 'ghi')).toBe('847be85b105b36fdcee407adc4bb19a0918375e3');
		expect(await $crypto.hmacSHA1('jkl', 'mno')).toBe('b00a80d0b715b49b5175e877b3017529f3733add');
	});
	test('$crypto.sha256()', async () => {
		expect((await $crypto.sha256('')).length).toBe(64);
		expect(await $crypto.sha256('')).toBe('e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855');

		expect((await $crypto.sha256('abc')).length).toBe(64);
		expect(await $crypto.sha256('abc')).toBe('ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad');

		expect(await $crypto.sha256('def')).toBe('cb8379ac2098aa165029e3938a51da0bcecfc008fd6795f401178647f96c5b34');
		expect(await $crypto.sha256('ghi')).toBe('50ae61e841fac4e8f9e40baf2ad36ec868922ea48368c18f9535e47db56dd7fb');
	});
	test('$crypto.hmacSHA256()', async () => {
		expect((await $crypto.hmacSHA256('', '')).length).toBe(64);
		expect(await $crypto.hmacSHA256('', '')).toBe('b613679a0814d9ec772f95d778c35fc5ff1697c493715653c6c712144292c5ad');

		expect((await $crypto.hmacSHA256('abc', 'def')).length).toBe(64);
		expect(await $crypto.hmacSHA256('abc', 'def')).toBe('397f467341e4d78c474867ef3261cdb46c0e10351e9a989963e6cb2dce40ee5d');

		expect(await $crypto.hmacSHA256('def', 'ghi')).toBe('08938c5bf9909bd400090b526a24add2c13c2a4e347e081416acd1d9e5570197');
		expect(await $crypto.hmacSHA256('jkl', 'mno')).toBe('58662efdecc80aec78edc1fe30f313ccbb4cfbce86e9637c3cfd24b1ffe81506');
	});
	test('$crypto.sha384()', async () => {
		expect((await $crypto.sha384('')).length).toBe(96);
		expect(await $crypto.sha384('')).toBe('38b060a751ac96384cd9327eb1b1e36a21fdb71114be07434c0cc7bf63f6e1da274edebfe76f65fbd51ad2f14898b95b');

		expect((await $crypto.sha384('abc')).length).toBe(96);
		expect(await $crypto.sha384('abc')).toBe('cb00753f45a35e8bb5a03d699ac65007272c32ab0eded1631a8b605a43ff5bed8086072ba1e7cc2358baeca134c825a7');

		expect(await $crypto.sha384('def')).toBe('180c325cccb299e76ec6c03a5b5a7755af8ef499906dbf531f18d0ca509e4871b0805cac0f122b962d54badc6119f3cf');
		expect(await $crypto.sha384('ghi')).toBe('1ad66ef0418b7e24de0bf2db0c46e700bd8a705efd781a477f5663561970f418f85a159ead0a6de87f17eba03cb7f542');
	});
	test('$crypto.hmacSHA384()', async () => {
		expect((await $crypto.hmacSHA384('', '')).length).toBe(96);
		expect(await $crypto.hmacSHA384('', '')).toBe('6c1f2ee938fad2e24bd91298474382ca218c75db3d83e114b3d4367776d14d3551289e75e8209cd4b792302840234adc');

		expect((await $crypto.hmacSHA384('abc', 'def')).length).toBe(96);
		expect(await $crypto.hmacSHA384('abc', 'def')).toBe('43e1d040a32182a0a4df43e7d95eb8c4a104fed3dd4d0fd39944e522626da148b2a7ac3926b8e4bb78892ec497bf2955');

		expect(await $crypto.hmacSHA384('def', 'ghi')).toBe('fd2180d7ef3b9f4cdacf68e29a8cadda1c547c6e6231fb1af7c819ebab743c0dab811c9a10574d3246dd8270e2f6a4f5');
		expect(await $crypto.hmacSHA384('jkl', 'mno')).toBe('3bd67771180e5e280930f4a888bfd4577f3a2a011782a0d036fd863b771c5e535f903d346b37625d7ad917669a1582ef');
	});
	test('$crypto.sha512()', async () => {
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
	test('$crypto.hmacSHA512()', async () => {
		expect((await $crypto.hmacSHA512('', '')).length).toBe(128);
		expect(await $crypto.hmacSHA512('', '')).toBe(
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
	test('$crypto.randomNumber()', async () => {
		expect(typeof $crypto.randomNumber()).toBe('number');
		expect(typeof $crypto.randomNumber(0, 1)).toBe('number');
		expect(typeof $crypto.randomNumber(0, Number.MAX_SAFE_INTEGER)).toBe('number');
	});
	test('$crypto.randomString()', async () => {
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
	test('$crypto.uuidV4()', async () => {
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
	test('$crypto.uuidV4({ dashes: true })', async () => {
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
});

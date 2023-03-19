/**
 * Test suite.
 */

import { $crypto } from '../index.js';
import { describe, test, expect } from 'vitest';

describe('$crypto tests', async () => {
	test('$crypto.md5()', async () => {
		expect($crypto.md5('').length).toBe(32);
		expect($crypto.md5('')).toBe('d41d8cd98f00b204e9800998ecf8427e');

		expect($crypto.md5('').length).toBe(32);
		expect($crypto.md5('abc')).toBe('900150983cd24fb0d6963f7d28e17f72');

		expect($crypto.md5('def')).toBe('4ed9407630eb1000c0f6b63842defa7d');
		expect($crypto.md5('ghi')).toBe('826bbc5d0522f5f20a1da4b60fa8c871');
	});
	test('$crypto.sha1()', async () => {
		expect($crypto.sha1('').length).toBe(40);
		expect($crypto.sha1('')).toBe('da39a3ee5e6b4b0d3255bfef95601890afd80709');

		expect($crypto.sha1('abc').length).toBe(40);
		expect($crypto.sha1('abc')).toBe('a9993e364706816aba3e25717850c26c9cd0d89d');

		expect($crypto.sha1('def')).toBe('589c22335a381f122d129225f5c0ba3056ed5811');
		expect($crypto.sha1('ghi')).toBe('481743d632b80d39bc2771d19be3ca3005b3f8af');
	});
	test('$crypto.hmacSHA1()', async () => {
		expect($crypto.hmacSHA1('', '').length).toBe(40);
		expect($crypto.hmacSHA1('', '')).toBe('fbdb1d1b18aa6c08324b7d64b71fb76370690e1d');

		expect($crypto.hmacSHA1('abc', 'def').length).toBe(40);
		expect($crypto.hmacSHA1('abc', 'def')).toBe('7584ee14493072cd8d9ae850e0ff090538230f8c');

		expect($crypto.hmacSHA1('def', 'ghi')).toBe('847be85b105b36fdcee407adc4bb19a0918375e3');
		expect($crypto.hmacSHA1('jkl', 'mno')).toBe('b00a80d0b715b49b5175e877b3017529f3733add');
	});
	test('$crypto.sha256()', async () => {
		expect($crypto.sha256('').length).toBe(64);
		expect($crypto.sha256('')).toBe('e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855');

		expect($crypto.sha256('abc').length).toBe(64);
		expect($crypto.sha256('abc')).toBe('ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad');

		expect($crypto.sha256('def')).toBe('cb8379ac2098aa165029e3938a51da0bcecfc008fd6795f401178647f96c5b34');
		expect($crypto.sha256('ghi')).toBe('50ae61e841fac4e8f9e40baf2ad36ec868922ea48368c18f9535e47db56dd7fb');
	});
	test('$crypto.hmacSHA256()', async () => {
		expect($crypto.hmacSHA256('', '').length).toBe(64);
		expect($crypto.hmacSHA256('', '')).toBe('b613679a0814d9ec772f95d778c35fc5ff1697c493715653c6c712144292c5ad');

		expect($crypto.hmacSHA256('abc', 'def').length).toBe(64);
		expect($crypto.hmacSHA256('abc', 'def')).toBe('397f467341e4d78c474867ef3261cdb46c0e10351e9a989963e6cb2dce40ee5d');

		expect($crypto.hmacSHA256('def', 'ghi')).toBe('08938c5bf9909bd400090b526a24add2c13c2a4e347e081416acd1d9e5570197');
		expect($crypto.hmacSHA256('jkl', 'mno')).toBe('58662efdecc80aec78edc1fe30f313ccbb4cfbce86e9637c3cfd24b1ffe81506');
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

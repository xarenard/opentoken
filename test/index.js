import OpenToken from "../src";
import {assert, expect} from 'chai';
import sinon from 'sinon';
import OpenTokenUtils from "../src/codec/opentoken/utils";

const NOT_BEFORE_CLAIM = '2013-04-02T02:38:32Z';
const NOT_AFTER_CLAIM = '2013-04-02T02:43:32Z';
const RENEW_UNTIL = NOT_AFTER_CLAIM;
const EXPECTED_PAYLOAD = `subject=opentoken\nnot-before=${NOT_BEFORE_CLAIM}\nnot-on-or-after=${NOT_AFTER_CLAIM}\nrenew-until=${RENEW_UNTIL}\nfoo=bar\nbar=baz`;
const EXPECTED_PAYLOAD_SUBJECT = `subject=joe\nnot-before=${NOT_BEFORE_CLAIM}\nnot-on-or-after=${NOT_AFTER_CLAIM}\nrenew-until=${RENEW_UNTIL}\nfoo=bar\nbar=baz`;
const PAYLOAD_TO_ENCODE = 'foo=bar\nbar=baz'

describe("OpenToken Test Cases", () => {

	let token = null;
	let otk = null;

	beforeEach('OpenToken instantiation', () => {
		sinon.stub(OpenTokenUtils, 'notBefore').returns(NOT_BEFORE_CLAIM);
		sinon.stub(OpenTokenUtils, 'notOnOrAfter').returns(NOT_AFTER_CLAIM);
		sinon.stub(OpenTokenUtils, 'renewUntil').returns(RENEW_UNTIL);

	});
	afterEach(function () {
		sinon.restore();
	});
	describe('When using default algorithm (AES 256)', () => {
		it('OpenToken encoding should succeed.', () => {
			const otk = new OpenToken('password');
			token = otk.encode(PAYLOAD_TO_ENCODE);
			expect(token).to.not.equal(null);
		});

		it('OpenToken decoding should succeed.', () => {
			const otk = new OpenToken('password');
			const decodedPayload = otk.decode(token);
			assert.equal(decodedPayload, EXPECTED_PAYLOAD);
		});
	});

	describe('When using AES 256', () => {
		it('OpenToken encoding should succeed.', () => {
			const otk = new OpenToken('password', {cipher: OpenToken.CIPHER_AES_256_CBC});
			token = otk.encode(PAYLOAD_TO_ENCODE);
			expect(token).to.not.equal(null);
		});

		it('OpenToken decoding should succeed.', () => {
			const otk = new OpenToken('password', {cipher: OpenToken.CIPHER_AES_256_CBC});
			const decodedPayload = otk.decode(token);
			assert.equal(decodedPayload, EXPECTED_PAYLOAD);
		});
	});

	describe('When using AES 128', () => {
		it('OpenToken encoding should succeed.', () => {
			const otk = new OpenToken('password', {cipher: OpenToken.CIPHER_AES_128_CBC});
			token = otk.encode(PAYLOAD_TO_ENCODE);
			expect(token).to.not.equal(null);
		});

		it('OpenToken decoding should succeed.', () => {
			//    const o = sinon.stub(OpenTokenUtils,'notBefore').returns(NOT_BEFORE_CLAIM);
			const otk = new OpenToken('password', {cipher: OpenToken.CIPHER_AES_128_CBC});
			const decodedPayload = otk.decode(token);
			assert.equal(decodedPayload, EXPECTED_PAYLOAD);
		});
	});

	describe('When using 3DES 168', () => {
		it('OpenToken encoding should succeed.', () => {
			const otk = new OpenToken('password', {cipher: OpenToken.CIPHER_DES_TRIPLE_168_CBC});
			token = otk.encode(PAYLOAD_TO_ENCODE);
			expect(token).to.not.equal(null);
		});
		it('OpenToken decoding should succeed.', () => {
			const otk = new OpenToken('password', {cipher: OpenToken.CIPHER_DES_TRIPLE_168_CBC});

			const decodedPayload = otk.decode(token);
			assert.equal(decodedPayload,EXPECTED_PAYLOAD);
		});
	});
	describe('When using dedicated subject', () => {
		it('OpenToken encoding should succeed.', () => {
			const otk = new OpenToken('password', {cipher: OpenToken.CIPHER_DES_TRIPLE_168_CBC});
			token = otk.encode(PAYLOAD_TO_ENCODE, 'joe');
			expect(token).to.not.equal(null);
		});
		it('OpenToken decoding should succeed.', () => {
			const otk = new OpenToken('password', {cipher: OpenToken.CIPHER_DES_TRIPLE_168_CBC});

			const decodedPayload = otk.decode(token);
			assert.equal(decodedPayload,EXPECTED_PAYLOAD_SUBJECT);
		});
	});

	describe('When using Key value Map', () => {
		it('OpenToken encoding should succeed.', () => {
			const otk = new OpenToken('password');
			const otkMap = new Map();
			otkMap.set('foo', 'bar');
			otkMap.set('bar', 'baz');
			token = otk.encodeMap(otkMap);
			expect(token).to.not.equal(null);
		});

		it('OpenToken decoding should succeed.', () => {
			const otk = new OpenToken('password');

			const otkMap = otk.decodeAsMap(token);
			assert.isTrue(otkMap.has('foo'));
			assert.equal('bar', otkMap.get('foo'));
			assert.isTrue(otkMap.has('bar'));
			assert.equal('baz', otkMap.get('bar'));
		});
	});
	describe('When using option not after', () => {
		let now = new Date();
		it('OpenToken encoding should succeed.', () => {
			sinon.restore();
//             sinon.stub(OpenTokenUtils,'date').returns(now);
			//          console.log(now);
			const otk = new OpenToken('secret',{notAfter: 600});
			const otkMap = new Map([['foo', 'bar'], ['bar', 'baz']]);
			token = otk.encodeMap(otkMap);
			expect(token).to.not.equal(null);
		});

		it('OpenToken decoding should succeed.', () => {
			sinon.restore();
			const otk = new OpenToken('secret');
			const otkMap = otk.decodeAsMap(token);
			assert.isTrue(otkMap.has('not-on-or-after'));
			const notAfter = otkMap.get('not-on-or-after');
			//if greater than 300, option has been taken into account
			assert.isTrue(Math.floor((new Date(notAfter) - new Date()) / 1000) > 300);
		});
	})
});

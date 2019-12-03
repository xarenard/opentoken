import OpenTokenUtils from '../../../lib/codec/opentoken/utils';
import {expect, assert} from 'chai';

describe('OpenToken Data Conversion', () => {
	describe("From OpenToken payload", () => {
		it('Should succeed', () => {

			const otkPayload = 'baz=bar\nbar=foo';
			const payloadMap = OpenTokenUtils.dataToMap(otkPayload);
			assert.isTrue(payloadMap.has('baz'));
			assert.equal('bar', payloadMap.get('baz'));
			assert.isTrue(payloadMap.has('bar'));
			assert.equal('foo', payloadMap.get('bar'));
		});

		it('With same keys should succeed', () => {

			const otkPayload = 'baz=bar\nbar=foo\nbaz=bir';
			const payloadMap = OpenTokenUtils.dataToMap(otkPayload);

			assert.isTrue(payloadMap.has('baz'));
			assert.isTrue(payloadMap.get('baz').includes('bir'));
			assert.isTrue(payloadMap.get('baz').includes('bar'));
			assert.isTrue(payloadMap.has('bar'));
			assert.equal('foo', payloadMap.get('bar'));
		});
	});

	describe("From Map to Opentoken payload", () => {
		it('Should succeed', () => {
			const otkMap = new Map();
			otkMap.set('baz', 'bar');
			otkMap.set('bar', 'foo');

			const expectedPayload = 'baz=bar\nbar=foo';
			const actualPayload = OpenTokenUtils.mapToData(otkMap);
			assert.equal(actualPayload, expectedPayload);
		});

		it('Should succeed using the same key', () => {

			const expectedPayload = 'baz=bar\nbaz=bir\nbar=foo';
			const otkMap = new Map();
			otkMap.set('baz', ['bar','bir']);
			otkMap.set('bar', 'foo');

			const actualPayload = OpenTokenUtils.mapToData(otkMap);
			assert.equal(actualPayload, expectedPayload);
		});
	});
});
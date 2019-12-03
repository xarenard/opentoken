import OpenToken from "../lib";
import {assert, expect} from 'chai';

const PAYLOAD = 'foo=bar\nbar=baz';

describe("OpenToken Test Cases", () => {

    let token = null;
    let otk = null;

    beforeEach('OpenToken instantiation', () => {
        otk = new OpenToken('blabla');
    });

    describe('When using default algorithm (AES 256)', () => {
        it('OpenToken encoding should succeed.', () => {
            token = otk.encode(PAYLOAD);
            expect(token).to.not.equal(null);
        });

        it('OpenToken decoding should succeed.', () => {
            const decodedPayload = otk.decode(token);
            assert.equal(decodedPayload, PAYLOAD);
        });
    });

    describe('When using AES 256', () => {
        it('OpenToken encoding should succeed.', () => {
            token = otk.encode(PAYLOAD, OpenToken.CIPHER_AES_256_CBC);
            expect(token).to.not.equal(null);
        });

        it('OpenToken decoding should succeed.', () => {
            const decodedPayload = otk.decode(token);
            assert.equal(decodedPayload, PAYLOAD);
        });
    });

    describe('When using AES 128', () => {
        it('OpenToken encoding should succeed.', () => {
            token = otk.encode(PAYLOAD, OpenToken.CIPHER_AES_128_CBC);
            expect(token).to.not.equal(null);
        });

        it('OpenToken decoding should succeed.', () => {
            const decodedPayload = otk.decode(token);
            assert.equal(decodedPayload, PAYLOAD);
        });
    });

    describe('When using 3DES 168', () => {
        it('OpenToken encoding should succeed.', () => {
            token = otk.encode(PAYLOAD, OpenToken.CIPHER_DES_TRIPLE_168_CBC);
            expect(token).to.not.equal(null);
        });
        it('OpenToken decoding should succeed.', () => {
            const decodedPayload = otk.decode(token);
            assert.equal(decodedPayload, PAYLOAD);
        });
    });
    describe('When using Key value Map', () => {
        it('OpenToken encoding should succeed.', () => {
            const otkMap = new Map();
            otkMap.set('foo', 'bar');
            otkMap.set('bar', 'baz');
            token = otk.encodeMap(otkMap);
            expect(token).to.not.equal(null);
        });

        it('OpenToken decoding should succeed.', () => {
            const otkMap = otk.decodeAsMap(token);
            assert.isTrue(otkMap.has('foo'));
            assert.equal('bar', otkMap.get('foo'));
            assert.isTrue(otkMap.has('bar'));
            assert.equal('baz', otkMap.get('bar'));
        });
    })
});

import OpenToken from "../src";
import {assert, expect} from 'chai';
import sinon from 'sinon';
import OpenTokenUtils from "../src/codec/opentoken/utils";
const NOT_BEFORE_CLAIM = '2013-04-02T02:38:32Z';
const NOT_AFTER_CLAIM = '2013-04-02T02:43:32Z';
const RENEW_UNTIL = NOT_AFTER_CLAIM;
const EXPECTED_PAYLOAD = `subject=me\nnot-before=${NOT_BEFORE_CLAIM}\nnot-on-or-after=${NOT_AFTER_CLAIM}\nrenew-until=${RENEW_UNTIL}\nfoo=bar\nbar=baz`;
const PAYLOAD_TO_ENCODE= 'foo=bar\nbar=baz'

describe("OpenToken Test Cases", () => {

    let token = null;
    let otk = null;

    beforeEach('OpenToken instantiation', () => {
        otk = new OpenToken('password','me');
        sinon.stub(OpenTokenUtils,'notBefore').returns(NOT_BEFORE_CLAIM);
        sinon.stub(OpenTokenUtils,'notOnOrAfter').returns(NOT_AFTER_CLAIM);
        sinon.stub(OpenTokenUtils,'renewUntil').returns(RENEW_UNTIL);

    });
    afterEach(function () {
        sinon.restore();
    });
    describe('When using default algorithm (AES 256)', () => {
        it('OpenToken encoding should succeed.', () => {
            token = otk.encode(PAYLOAD_TO_ENCODE);
            expect(token).to.not.equal(null);
        });

        it('OpenToken decoding should succeed.', () => {
            const decodedPayload = otk.decode(token);
            assert.equal(decodedPayload, EXPECTED_PAYLOAD);
        });
    });

    describe('When using AES 256', () => {
        it('OpenToken encoding should succeed.', () => {
            token = otk.encode(PAYLOAD_TO_ENCODE, OpenToken.CIPHER_AES_256_CBC);
            expect(token).to.not.equal(null);
        });

        it('OpenToken decoding should succeed.', () => {
            const decodedPayload = otk.decode(token);
            assert.equal(decodedPayload, EXPECTED_PAYLOAD);
        });
    });

    describe('When using AES 128', () => {
        it('OpenToken encoding should succeed.', () => {
            token = otk.encode(PAYLOAD_TO_ENCODE, OpenToken.CIPHER_AES_128_CBC);
            expect(token).to.not.equal(null);
        });

        it('OpenToken decoding should succeed.', () => {
        //    const o = sinon.stub(OpenTokenUtils,'notBefore').returns(NOT_BEFORE_CLAIM);

            const decodedPayload = otk.decode(token);
            assert.equal(decodedPayload, EXPECTED_PAYLOAD);
        });
    });

    describe('When using 3DES 168', () => {
        it('OpenToken encoding should succeed.', () => {
            token = otk.encode(PAYLOAD_TO_ENCODE, OpenToken.CIPHER_DES_TRIPLE_168_CBC);
            expect(token).to.not.equal(null);
        });
        it('OpenToken decoding should succeed.', () => {
            const decodedPayload = otk.decode(token);
            assert.equal(decodedPayload, EXPECTED_PAYLOAD);
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

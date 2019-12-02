import OpenToken from "../lib";
import {assert,expect} from 'chai';
import OpenTokenProvider from "../lib/codec/opentoken";

const PAYLOAD = 'foo=bar\nbar=baz';

describe("OpenToken lib Test", () => {


    let token = null;
    let otk = null;
    beforeEach('OpenToken instantiation', () => {
        console.log('ok')
        otk = new OpenTokenProvider('2Federate');

    });

    describe('When using default algorithm (AES 256)', ()=>
    {
        it('Encoding should succeed.', () => {
            token = otk.encode(PAYLOAD);
            expect(token).to.not.equal(null);
        });
        it('Decoding should succeed.', () => {
            const decodedPayload =  otk.decode(token);
            assert.equal(decodedPayload,PAYLOAD);
        });
    });

    describe('When using AES 256', ()=>
    {
        it('Encoding should succeed.', () => {
            token = otk.encode(PAYLOAD,OpenToken.CIPHER_AES_256_CBC);
            expect(token).to.not.equal(null);
        });
        it('Decoding should succeed.', () => {
            const decodedPayload =  otk.decode(token);
            assert.equal(decodedPayload,PAYLOAD);
        });
    });

    describe('When using AES 128', ()=>
    {
        it('Encoding should succeed.', () => {
            token = otk.encode(PAYLOAD,OpenToken.CIPHER_AES_128_CBC);
            expect(token).to.not.equal(null);
        });
        it('Decoding should succeed.', () => {
            const decodedPayload =  otk.decode(token);
            assert.equal(decodedPayload,PAYLOAD);
        });
    });
    describe('When using 3DES 168', ()=>
    {
        it('Encoding should succeed.', () => {
            token = otk.encode(PAYLOAD,OpenToken.CIPHER_DES_TRIPLE_168_CBC);
            expect(token).to.not.equal(null);
        });
        it('Decoding should succeed.', () => {
            const decodedPayload =  otk.decode(token);
            assert.equal(decodedPayload,PAYLOAD);
        });
    });
});

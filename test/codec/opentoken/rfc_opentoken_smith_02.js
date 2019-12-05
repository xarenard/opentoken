import OpenTokenProvider from "../../../src/codec/opentoken";
import OpenTokenCipher from "../../../src/codec/opentoken/ciphers";
import {assert} from 'chai';
import sinon from 'sinon';

const OTK_PAYLOAD = 'foo=bar\nbar=baz';

const OTK_TEST_DATAS = {
    CIPHER_AES_128_CBC: {
        key: 'a66C9MvM8eY4qJKyCXKW+w==',
        token: 'UFRLAQK9THj0okLTUB663QrJFg5qA58IDhAb93ondvcx7sY6s44eszNqAAAga5W8Dc4XZwtsZ4qV3_lDI-Zn2_yadHHIhkGqNV5J9kw*'
    },
    CIPHER_AES_256_CBC: {
        key: 'a66C9MvM8eY4qJKyCXKW+19PWDeuc3thDyuiumak+Dc=',
        token: 'UFRLAQEujlLGEvmVKDKyvL1vaZ27qMYhTxDSAZwtaufqUff7GQXTjvWBAAAgJJGPta7VOITap4uDZ_OkW_Kt4yYZ4BBQzw_NR2CNE-g*'
    },
    CIPHER_DES_TRIPLE_168_CBC: {
        key: 'a66C9MvM8eY4qJKyCXKW+19PWDeuc3th',
        token: 'UFRLAQNoCsuAwybXOSBpIc9ZvxQVx_3fhghqSjy-pNJpfgAAGGlGgJ79NhX43lLRXAb9Mp5unR7XFWopzw**' }
};


describe('RFC Open Token Smith 02', () => {
    let otk = null;
    beforeEach('OpenToken instanciation', () => {
        otk = new OpenTokenProvider('password','PTK','PTK');
    });

    describe("When decoding OpenToken", () => {

        it('Using AES 128 CBC should succeed', () => {
            const token = OTK_TEST_DATAS.CIPHER_AES_128_CBC.token;
            sinon.stub(otk, '_generateKey').returns(OTK_TEST_DATAS.CIPHER_AES_128_CBC.key);
            const value = otk.decode(token);
            assert.equal(value, OTK_PAYLOAD)
        });

        it('Using AES 256 CBC should succeed', () => {
            const token = OTK_TEST_DATAS.CIPHER_AES_256_CBC.token;
            sinon.stub(otk, '_generateKey').returns(OTK_TEST_DATAS.CIPHER_AES_256_CBC.key);
            const value = otk.decode(token);
            assert.equal(value, OTK_PAYLOAD)
        });
        it('Using TRIPLE DES 168 CBC should succeed', () => {
            const token = OTK_TEST_DATAS.CIPHER_DES_TRIPLE_168_CBC.token;
            sinon.stub(otk, '_generateKey').returns(OTK_TEST_DATAS.CIPHER_DES_TRIPLE_168_CBC.key);
            const value = otk.decode(token);
            assert.equal(value, OTK_PAYLOAD)
        });
    });

    describe("When encoding OpenToken", () => {
        it('Using AES 128 CBC should succeed', () => {
            const expectedToken = OTK_TEST_DATAS.CIPHER_AES_128_CBC.token;
            sinon.stub(otk,'_iv').returns(Buffer.from([0x1b,0xf7,0x7a,0x27,0x76,0xf7,0x31,0xee,0xc6,0x3a, 0xb3,0x8e,0x1e,0xb3,0x33,0x6a]));
            sinon.stub(otk, '_generateKey').returns(OTK_TEST_DATAS.CIPHER_AES_128_CBC.key);
            sinon.stub(otk, '_normalizePayload').returns(OTK_PAYLOAD);
            const token = otk.encode(OTK_PAYLOAD,OpenTokenCipher.CIPHER_AES_128_CBC);
            assert.equal(token, expectedToken);
        });

        it('Using AES 256 CBC should succeed', () => {
            const expectedToken = OTK_TEST_DATAS.CIPHER_AES_256_CBC.token;
            sinon.stub(otk,'_iv').returns(Buffer.from([0xd2,0x01,0x9c,0x2d,0x6a,0xe7,0xea,0x51,0xf7,0xfb, 0x19,0x05,0xd3,0x8e,0xf5,0x81]));
            sinon.stub(otk, '_generateKey').returns(OTK_TEST_DATAS.CIPHER_AES_256_CBC.key);
            sinon.stub(otk, '_normalizePayload').returns(OTK_PAYLOAD);
            const token = otk.encode(OTK_PAYLOAD,OpenTokenCipher.CIPHER_AES_256_CBC);
            assert.equal(token, expectedToken);
        });

        it('Using Triple Des 168 CBC should succeed', () => {
            const expectedToken = OTK_TEST_DATAS.CIPHER_DES_TRIPLE_168_CBC.token;
            sinon.stub(otk,'_iv').returns(Buffer.from([0x6a,0x4a,0x3c,0xbe,0xa4,0xd2,0x69,0x7e]));
            sinon.stub(otk, '_generateKey').returns(OTK_TEST_DATAS.CIPHER_DES_TRIPLE_168_CBC.key);
            sinon.stub(otk, '_normalizePayload').returns(OTK_PAYLOAD);
            const token = otk.encode(OTK_PAYLOAD,OpenTokenCipher.CIPHER_DES_TRIPLE_168_CBC);
            assert.equal(token, expectedToken);
        });
    });
});

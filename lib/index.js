import OpenTokenProvider from './codec/opentoken';

/**
 * class OpenToken
 */
class OpenToken {

    static CIPHER_NONE = null;
    /** @const {number} */
    static CIPHER_AES_256_CBC = 1;
    /** @const {number} */
    static CIPHER_AES_128_CBC = 2;
    /** @const {number} */
    static CIPHER_DES_TRIPLE_168_CBC = 3;
    /** @const {number} */
    static CIPHER_DEFAULT = OpenTokenProvider.CIPHER_AES_256_CBC;

    _openTokenProvider;

    constructor(password) {
        this._openTokenProvider = new OpenTokenProvider(password);
    }

    /**
     * Encode to an Opentoken
     *
     * @param {string} payload opentoken plaintext payload format
     * @param {integer} [cipher=OpenToken.CIPHER_AES_256_CBC]  OpenToken.CIPHER_AES_256_CBC | OpenToken.CIPHER_AES_128_CBC | OpenToken.CIPHER_DES_TRIPLE_168_CBC

     * @returns token OpenToken base64 encoded
     */
    encode(payload, cipher = OpenToken.CIPHER_DEFAULT) {
        return this._openTokenProvider.encode(payload, cipher);
    }

    /**
     * Decode an opentoken
     *
     * @Method
     * @param {string} token The base64 encoded Opentoken
     * @returns payload OpenToken payload
     */
    decode(token) {
        return this._openTokenProvider.decode(token).toString();
    }
}

export default OpenToken;
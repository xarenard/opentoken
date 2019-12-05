import OpenTokenProvider from './codec/opentoken';
import OpenTokenUtils from './codec/opentoken/utils';

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

	constructor(password,subject, options = {}) {
		this._openTokenProvider = new OpenTokenProvider(password,subject, options);
	}

	/**
	 * Encode to an Opentoken
	 *
	 * @param {string} payload opentoken plaintext payload format
	 * @param {integer} [cipher=OpenToken.CIPHER_AES_256_CBC]  OpenToken.CIPHER_AES_256_CBC | OpenToken.CIPHER_AES_128_CBC | OpenToken.CIPHER_DES_TRIPLE_168_CBC

	 * @returns token OpenToken base64 encoded
	 */
	encode(payload, cipher = OpenToken.CIPHER_DEFAULT) {
		if (!payload || typeof payload !== 'string') {
			throw new Error('Invalid payload.');
		}
		return this._openTokenProvider.encode(payload, cipher);
	}

	/**
	 * Encode to an Opentoken
	 *
	 * @param {Map} payload opentoken as Key value Map
	 * @param {integer} [cipher=OpenToken.CIPHER_AES_256_CBC]  OpenToken.CIPHER_AES_256_CBC | OpenToken.CIPHER_AES_128_CBC | OpenToken.CIPHER_DES_TRIPLE_168_CBC

	 * @returns token OpenToken base64 encoded
	 */
	encodeMap(map, cipher = OpenToken.CIPHER_DEFAULT) {
		if (!map || !(map instanceof Map)) {
			throw new Error('Invalid type. Map type is required.');
		}
		const payload = OpenTokenUtils.mapToData(map);
		return this.encode(payload, cipher);
	}

	/**
	 * Decode an opentoken
	 *
	 * @Method
	 * @param {string} token The base64 encoded Opentoken
	 * @returns payload OpenToken payload
	 */
	decode(token) {
		if (!token) {
			throw new Error('Invalid Token');
		}
		return this._openTokenProvider.decode(token).toString();
	}

	/**
	 * Decode an opentoken
	 *
	 * @Method
	 * @param {string} token The base64 encoded Opentoken
	 * @returns payload OpenToken payload Map
	 */
	decodeAsMap(token) {
		if (!token) {
			throw new Error('Invalid Token');
		}

		const payload = this._openTokenProvider.decode(token).toString();
		return OpenTokenUtils.dataToMap(payload);
	}

	validateToken(token) {
		return this._openTokenProvider.validate(token);
	}
}

module.exports = OpenToken;
//export default OpenToken;
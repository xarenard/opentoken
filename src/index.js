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

	/**
	 * Constructor
	 * @param password
	 * @param options
	 */
	constructor(password, options = {}) {
		this._openTokenProvider = new OpenTokenProvider(password, options);
	}

	/**
	 * Encode to an Opentoken
	 *
	 * @param {string} payload opentoken plaintext payload format
	 * @param {string} [subject] The subject to which this token applies

	 * @returns token OpenToken base64 encoded
	 */
	encode(payload, subject) {
		if (!payload || typeof payload !== 'string') {
			throw new Error('Invalid payload.');
		}
		return this._openTokenProvider.encode(payload, subject);
	}

	/**
	 * Encode to an Opentoken
	 *
	 * @param {Map} payload opentoken as Key value Map
	 * @param {string} [subject]  The subject to which this token applies to.

	 * @returns token OpenToken base64 encoded
	 */
	encodeMap(map, subject) {
		if (!map || !(map instanceof Map)) {
			throw new Error('Invalid type. Map type is required.');
		}
		const payload = OpenTokenUtils.mapToData(map);
		return this.encode(payload, subject);
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

	validateToken(token, subject) {
		return this._openTokenProvider.validate(token, subject);
	}

	get options(){
		return null;
	}
}

module.exports = OpenToken;
//export default OpenToken;
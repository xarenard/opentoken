import OpenTokenProvider from './codec/opentoken';


class OpenToken {

	static CIPHER_NONE = null;
	static CIPHER_AES_256_CBC = 1;
	static CIPHER_AES_128_CBC = 2;
	static CIPHER_DES_TRIPLE_168_CBC = 3;
	static CIPHER_DEFAULT = OpenTokenProvider.CIPHER_AES_256_CBC;

	_openTokenProvider;

	constructor(password) {
		this._openTokenProvider = new OpenTokenProvider(password);
	}

	encode(payload, cipher=OpenToken.CIPHER_DEFAULT){
		return this._openTokenProvider.encode(payload,cipher);
	}

	decode(token){
		return this._openTokenProvider.decode(token).toString();
	}
}

export default OpenToken;
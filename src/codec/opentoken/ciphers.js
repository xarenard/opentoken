class OpenTokenCipher {

	/*----+--------+----------+------+---------+-----------+
	| ID | Cipher | Key Size | Mode | Padding | IV Length |
	+----+--------+----------+------+---------+-----------+
	| 0  | Null   | N/A      | N/A  | N/A     | 0         |
	| 1  | AES    | 256 bits | CBC  | PKCS 5  | 16        |
	| 2  | AES    | 128 bits | CBC  | PKCS 5  | 16        |
	| 3  | 3DES   | 168 bits | CBC  | PKCS 5  | 8         |
	+----+--------+----------+------+---------+-----------*/

	static CIPHER_NONE = 0;
	static CIPHER_AES_256_CBC = 1;
	static CIPHER_AES_128_CBC = 2;
	static CIPHER_DES_TRIPLE_168_CBC = 3;

	static _ciphers = [
		{algorithm: null, ivLength: 0},
		{algorithm: 'aes-256-cbc', ivLength: 16, keyLength: 256},
		{algorithm: 'aes-128-cbc', ivLength: 16, keyLength: 128},
		{algorithm: 'des-ede3-cbc', ivLength: 8, keyLength: 192}];

	static id(cipher) {
		return OpenTokenCipher._ciphers[cipher].id;
	}

	static algorithm(id) {
		return OpenTokenCipher._ciphers[id].algorithm;
	}

	static ivLength(id) {
		return OpenTokenCipher._ciphers[id].ivLength;
	}

	static keyLength(id) {
		return OpenTokenCipher._ciphers[id].keyLength;
	}
}

export default OpenTokenCipher;
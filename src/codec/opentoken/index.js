import {createHmac, randomBytes, createCipheriv, createDecipheriv, pbkdf2Sync} from 'crypto';
import {inflateSync, deflateSync} from 'zlib';
import OpenTokenCipher from './ciphers';
import OpenTokenUtils from './utils';

//import OpenTokenUtils from './utils';

class OpenTokenProvider {

	static CIPHER_NONE = null;
	static CIPHER_AES_256_CBC = 1;
	static CIPHER_AES_128_CBC = 2;
	static CIPHER_DES_TRIPLE_168_CBC = 3;
	static CIPHER_HMAC_HASH = 'sha1';
	static CIPHER_DEFAULT = OpenTokenProvider.CIPHER_AES_256_CBC;
	static DEFAULT_SUBJECT = 'opentoken';

	prefix = null;
	password = null;

	_options;

	constructor(password, options = {}) {
		this.password = password;
		this._options = Object.assign({}, this._defaultOption(), options);
	}

	_defaultOption() {
		return Object.assign(
			{},
			{
				prefix: 'OTK',
				notAfter: 300,
				renewUntil: 300,
				cipher: OpenTokenProvider.CIPHER_DEFAULT
			}
		);
	}

	decode(token) {

		if (!token) {
			throw new Error('Invalid Token');
		}
		return this._decode(token).toString('utf8');
	}

	encode(payload, subject = OpenTokenProvider.DEFAULT_SUBJECT) {
		if (!payload) {
			throw new Error('Invalid Token.');
		}
		return this._encode(payload, subject, this.options.cipher);
	}

	get options() {
		return this._options;
	}
	_hmac(data) {
		const {version, cipher, iv, payload} = data;
		const cipherId = cipher;
		const hmac = createHmac(OpenTokenProvider.CIPHER_HMAC_HASH, Buffer.from(this._generateKey(cipherId), 'base64'));
		return hmac
			.update(Buffer.from([version]))
			.update(Buffer.from([cipherId]))
			.update(iv)
			.update(payload)
			.digest();
	}

	_generateKey(cipherId = OpenTokenProvider.CIPHER_DEFAULT, salt = Buffer.from([0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00])) {
		const keyLength = OpenTokenCipher.keyLength(cipherId) / 8;
		const iterations = 1000;
		return pbkdf2Sync(this.password, salt, iterations, keyLength, OpenTokenProvider.CIPHER_HMAC_HASH).toString('base64');
	}

	_unpack(token) {
		const prefix = token.slice(0, 3).toString();
		if (!['OTK', 'PTK'].includes(prefix)) {
			throw new Error('Invalid Token Prefix.');
		}
		const version = token.readUInt8(3);
		if (version !== 1) {
			throw new Error('Invalid OpenToken Version.');
		}

		const cipherId = token.readUInt8(4);
		if (![0, 1, 2, 3].includes(cipherId)) {
			throw new Error('Invalid OpenToken Cipher Id.');
		}

		const hmac = token.slice(5, 25);
		const ivLength = token.readUInt8(25);
		const ivOffsetEnd = 26 + ivLength;
		const iv = token.slice(26, ivOffsetEnd);

		const payloadOffset = ivOffsetEnd + 3;
		const payLoadEncrypted = token.slice(payloadOffset, token.length);

		return {
			version: version,
			cipherId: cipherId,
			hmac: hmac,
			iv: iv,
			payloadEncrypted: payLoadEncrypted
		};
	}

	_decode(token) {
		const tokenBinary = Buffer.from(token, 'base64');
		if (tokenBinary.length < 26) {
			throw new Error('Invalid Token.');
		}

		const {version, cipherId, hmac, iv, payloadEncrypted} = this._unpack(tokenBinary);
		const payload = this._decryptPayload(payloadEncrypted, iv, cipherId);

		//recompute hmac
		const data = {
			version: version,
			cipher: cipherId,
			iv: iv,
			key_info: null,
			payload: payload
		};
		const computedHmac = this._hmac(data);

		// validate hmac
		if (computedHmac.compare(hmac) !== 0) {
			throw new Error('Invalid Mac');
		}
		return payload;
	}

	_decryptPayload(encryptedPayload, iv, cipherId) {
		const algorithm = OpenTokenCipher.algorithm(cipherId);
		const decipher = createDecipheriv(algorithm, Buffer.from(this._generateKey(cipherId), 'base64'), iv);
		decipher.setAutoPadding(true);
		const payloadDeflated = (Buffer.concat([decipher.update(encryptedPayload), decipher.final()]));
		return inflateSync(payloadDeflated);
	}

	_pack(payload, subject = OpenTokenProvider.DEFAULT_SUBJECT, cipherId = OpenTokenProvider.CIPHER_DEFAULT) {
		// append prefix
		const openTokenItems = [];
		//prefix
		const prefix = Buffer.from(this.options.prefix);
		openTokenItems.push(prefix);
		//version
		const version = Buffer.from([0x01]);
		openTokenItems.push(version);
		// cipherid
		const cipherIdBuffer = Buffer.from([cipherId]);
		openTokenItems.push(cipherIdBuffer);
		//iv and hmac
		const ivLength = OpenTokenCipher.ivLength(cipherId);
		const iv = this._iv(ivLength);

		const normalizedPayload = this._normalizePayload(payload, subject);
		//push hmac
		const hmacData = {
			'version': 1,
			'cipher': cipherId,
			'iv': iv,
			'key-info': null,
			'payload': normalizedPayload
		};
		const hmac = this._hmac(hmacData);
		openTokenItems.push(hmac);
		openTokenItems.push(Buffer.from([ivLength]));
		openTokenItems.push(iv);
		openTokenItems.push(Buffer.from([0x00]));
		// payload
		const payloadEncrypted = this._encryptPayload(normalizedPayload, iv, cipherId);
		const payloadLengthSizeBuffer = Buffer.allocUnsafe(2);
		payloadLengthSizeBuffer.writeUInt16BE(payloadEncrypted.length, 0);
		openTokenItems.push(payloadLengthSizeBuffer);
		openTokenItems.push(payloadEncrypted);
		return Buffer.concat(openTokenItems);
	}

	_normalizePayload(payload, sub = OpenTokenProvider.DEFAULT_SUBJECT) {
		const subject = `subject=${sub}`;
		const notBefore = `not-before=${OpenTokenUtils.notBefore()}`;
		const notAfter = `not-on-or-after=${OpenTokenUtils.notOnOrAfter(this._options.notAfter)}`;
		const renewUntil = `renew-until=${OpenTokenUtils.renewUntil(this._options.renewUntil)}`;
		return [subject, notBefore, notAfter, renewUntil, payload].join('\n');
	}

	_encode(payload, subject = OpenTokenProvider.DEFAULT_SUBJECT, cipherId = OpenTokenProvider.CIPHER_DEFAULT) {
		const openTokenBuffer = this._pack(payload, subject, cipherId);

		return openTokenBuffer.toString('base64')
			.replace(/\//g, '_')
			.replace(/\+/g, '-')
			.replace(/=/g, '*');
	}

	_encryptPayload(payload, iv, cipherId) {
		const deflatedPayload = deflateSync(payload);
		const algorithm = OpenTokenCipher.algorithm(cipherId);
		const cipher = createCipheriv(algorithm, Buffer.from(this._generateKey(cipherId), 'base64'), iv);
		return Buffer.concat([cipher.update(deflatedPayload), cipher.final()]);
	}

	_iv(ivLength) {
		return randomBytes(ivLength);
	}

	validate(token, subject) {
		const payload = this.decode(token);
		const kv = OpenTokenUtils.dataToMap(payload);
		if( subject) {
			if (!(kv.has('subject') && kv.get('subject') === subject)) {
				throw new Error('Invalid Subject');
			}
		}
		if (kv.has('not-before')) {
			const notBeforeDateString = kv.get('not-before');
			if (OpenTokenUtils.date().getTime() <  new Date(notBeforeDateString).getTime()){
				throw new Error('Invalid token - Token issued before current date.');
			}
		} else {
			throw new Error('Invalid token. Not-before claim missing ');
		}

		if (kv.has('not-on-or-after')) {
			const notAfterDateString = kv.get('not-on-or-after');
			if (OpenTokenUtils.date().getTime() > new Date(notAfterDateString).getTime()) {
				throw new Error('Invalid token - Token expired.');
			}

		} else {
			throw new Error('Invalid token. Not-on-or-after claim missing.');
		}
		return payload;
	}
}

export default OpenTokenProvider;
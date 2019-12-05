class OpenTokenUtils {

	static dataToMap(data) {
		const kvPairs = data.split('\n');
		const kvMap = new Map();
		kvPairs.forEach((kvs) => {
			const kv = kvs.split('=');
			if(kv.length != 2){
				throw new Error('Invalid OpenToken format');
			}
			let [key, value] = kv;
			if (kvMap.has(key)) {
				let existingValue = kvMap.get(key);
				value = Array.isArray(existingValue) ? existingValue.concat(value) : [existingValue].concat(value);
			}
			kvMap.set(key, value);
		});
		return kvMap;
	}

	static mapToData(map) {
		const datas = [];
		map.forEach((values, key) => {
			if (Array.isArray(values)) {
				values.forEach(value => {
					datas.push(key.concat('=', value));
				});
			} else {
				datas.push(key.concat('=', values));
			}
		});
		return datas.join('\n');
	}

	static renewUntil(seconds = 300){
		const now = OpenTokenUtils.date();
		return OpenTokenUtils._toUtc(now, seconds);
	}
	static notBefore(){
		const now = OpenTokenUtils.date();
		return OpenTokenUtils._toUtc(now);
	}

	static notOnOrAfter(seconds = 300) {
		const now = OpenTokenUtils.date();
		return OpenTokenUtils._toUtc(now, seconds);
	}

	static _toUtc(now = new Date, seconds = 0) {

		//		const now = OpenTokenUtils.date();
		now.setUTCSeconds(now.getUTCSeconds()+ seconds);

		const day = now.getUTCDate().toString().padStart(2,0);
		const month = (now.getUTCMonth() + 1).toString().padStart(2,0);
		const year = now.getUTCFullYear();
		const hour = now.getUTCHours().toString().padStart(2,0);
		const minutes = now.getUTCMinutes().toString().padStart(2,0);
		const sec = now.getUTCSeconds().toString().padStart(2,0);

		return `${year}-${month}-${day}T${hour}:${minutes}:${sec}Z`;

	}

	static date() {
		return new Date();
	}
}

export default OpenTokenUtils;
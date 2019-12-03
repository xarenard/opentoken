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
}

export default OpenTokenUtils;
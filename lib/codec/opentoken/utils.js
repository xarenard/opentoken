class OpenTokenUtils {

	static dataToMap(data) {
		const kvPairs = data.split('\n');
		const kvMap = new Map();
		kvPairs.forEach((kvs) => {
			const kv = kvs.split('=');

			if (kvMap.has(kv[0])) {
				let value = Array.from(kv[0], kvMap.get(kv[0]));
				kvMap.set(kv[0], value);
			} else {
				kvMap.set(kv[0], kv[1]);
			}
		});
		return kvMap;
	}

	mapToData(map) {
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
# opentoken

[![CircleCI](https://circleci.com/gh/xarenard/opentoken/tree/master.svg?style=svg)](https://circleci.com/gh/xarenard/opentoken/tree/master)

- [About](#about)
- [Installation](#installation)
- [Usage](#usage)
    - [Example](#example)
    - [Configuration](#configuration)
- [References](#references)
- [License](#license)
<a name="about"></a>
## About

OpenToken implementation (<a href="https://tools.ietf.org/html/draft-smith-opentoken-02" target="_blank">OpenToken Draft RFC</a>)


<a name="installation"></a>
## Installation
```
npm install --save @cibel/opentoken
```

<a name="usage"></a>
## Usage

<a name="example"></a>
### Example

#### Instantiation
```js
const OpenToken = require('@cibel/opentoken');
const otk = new OpenToken('mypassword');
```
#### Encoding
```js
/// from raw payload
const token = otk.encode('bar=be\nfoo=bar');
console.log(token); //T1RLAQECBByloAOoWT6XlHdV4Vv-Au7BmBDv9j3jjb6jY94w_2uBIedzAAAgsPNMulP3-r07X-S8a3_u9d5EZIvCK_9ujvvEnYk3MSM*

// from map
const payload =  new Map();
payload.set('bar','be');
payload.set('foo','bar');

const token = otk.encodeMap(payload);
console.log(token);
```
#### Decoding
```js

const data = otk.decode(token);
console.log(data);//bar=be\nfoo=bar

//or

const data = otk.decodeAsMap(token);
console.log(data);// Map { 'bar' => 'be', 'foo' => 'bar' }

```

<a name="configuration"></a>
#### Configuration

##### Constructor parameters


| Parameters    |  Value              | Description           |Default Value    |
| ------------ | ---------------------- | ----------------------- | ----------- 
| password   | any password       |  Password     |       |
| prefix  | OTK |PTK             | String                  |OTK          |


##### Encoding parameters

`[token]=encode(payload, cipher)`

| Option    | Mandatory | Value                   |  Default |   Description                            | Default value         |
|------------|-----------|---------------------------|-------|---------------------------------|-----------------|
|payload      | y         |string                | None |  Raw OpenToken payload                   | N/A             |
|cipher       | n         |integer                | OpenToken.CIPHER_AES_256_CBC |OpenToken.CIPHER_AES_256_CBC | OpenToken.CIPHER_AES_128_CBC | OpenToken.CIPHER_DES_256_CBC  | OpenToken.CIPHER_DES_TRIPLE_168_CBC                     | N/A             |

`[token]=encodeMap(payload, cipher)`

| Option    | Mandatory | Value                   |  Default |   Description                            | Default value         |
|------------|-----------|---------------------------|-------|---------------------------------|-----------------|
|payload      | y         |Map                | None |  Key value map                  | N/A             |
|cipher       | n         |integer                | OpenToken.CIPHER_AES_256_CBC |OpenToken.CIPHER_AES_256_CBC | OpenToken.CIPHER_AES_128_CBC | OpenToken.CIPHER_DES_256_CBC  | OpenToken.CIPHER_DES_TRIPLE_168_CBC                     | N/A             |

##### Decoding parameters
`[payload]=decode(token)`

| Option    | Mandatory | Value                   |  Default |   Description                            | Default value         |
|------------|-----------|---------------------------|-------|---------------------------------|-----------------|
|token      | y         |string                 | None |  OpenToken payload    | N/A             |


`[payloadAsMap]=decodeAsMap(token)`

| Option    | Mandatory | Value                   |  Default |   Description                            | Default value         |
|------------|-----------|---------------------------|-------|---------------------------------|-----------------|
|token      | y         |string                 | None |  OpenToken payload as Map       | N/A             |

       
<a name="references"></a>
## References
<a name="license"></a>
## License
`@cibel/opentoken` is [MIT licensed](./LICENSE)
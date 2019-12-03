# opentoken
Opentoken

[![CircleCI](https://circleci.com/gh/xarenard/opentoken/tree/master.svg?style=svg)](https://circleci.com/gh/xarenard/opentoken/tree/master)

- [About](#about)
- [Installation](#installation)
- [Usage](#usage)
    - [Example](#example)
- [References](#references)
- [License](#license)
<a name="about"></a>
## About

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
///from raw payload
const token = otk.encode('bar=be\nfoo=bar');
console.log(token); //T1RLAQECBByloAOoWT6XlHdV4Vv-Au7BmBDv9j3jjb6jY94w_2uBIedzAAAgsPNMulP3-r07X-S8a3_u9d5EZIvCK_9ujvvEnYk3MSM*

//or
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


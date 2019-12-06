# opentoken

[![CircleCI](https://circleci.com/gh/xarenard/opentoken/tree/master.svg?style=svg)](https://circleci.com/gh/xarenard/opentoken/tree/master)
[![codecov](https://codecov.io/gh/xarenard/opentoken/branch/master/graph/badge.svg)](https://codecov.io/gh/xarenard/opentoken)
[![Known Vulnerabilities](https://snyk.io/test/github/xarenard/opentoken/badge.svg?targetFile=package.json)](https://snyk.io/test/github/xarenard/opentoken?targetFile=package.json)

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

#### Import
```js
const OpenToken = require('@cibel/opentoken');
```
#### Encoding

##### Instantiation
```js
// instantiate with pbe password
const otk = new OpenToken('mypassword');

//or instantiate with options
const otk = new OpenToken('mypassword',{notAfter: 300,renewUntil: 300, cipher: OpenToken.CIPHER_AES_256_CBC});
```

##### Encoding from raw data
```js
/// Encode from raw OpenToken format
const subject = 'Alice';
const payload = 'foo=bar\nbar=baz';
const token = otk.encode(payload, subject);
console.log(token); 
//T1RLAQHYWXG5ELaGj5iUPQr-Enh5Jnm1jxB1xYzddUN5Et3jhYtn4coNAABwodDZZuXqG-lAHs9QGYeyjILE-KmR3lqnD-0wTpEUmQH98WaW0x0fscslpO8A8uqyfWaCuTkeSQOvkit7on1Sb-qg_dnGKLmt0sWigzPhRnNfv5RnpN8lByqwZgL8VIDq3IbSrHGVyvtZ55KC6n1ttQ**

```

##### Encoding from Map
```js
// Encode from map
const subject = 'Alice';
const payload =  new Map(['foo','bar'],['bar','baz']);
const token = otk.encodeMap(payload, subject);
console.log(token);
////T1RLAQHYWXG5ELaGj5iUPQr-Enh5Jnm1jxB1xYzddUN5Et3jhYtn4coNAABwodDZZuXqG-lAHs9QGYeyjILE-KmR3lqnD-0wTpEUmQH98WaW0x0fscslpO8A8uqyfWaCuTkeSQOvkit7on1Sb-qg_dnGKLmt0sWigzPhRnNfv5RnpN8lByqwZgL8VIDq3IbSrHGVyvtZ55KC6n1ttQ**


```
#### Decoding
##### Instantiation
```js
const otk = new OpenToken('mypassword');
```

##### Decode to OpenToken format
```js
const data = otk.decode(token);
console.log(data);
```

##### Decode to Map
```js
const data = otk.decodeAsMap(token);
console.log(data);
//Map { 'subject' => 'Alice','not-before' => '2019-12-06T14:12:53Z','not-on-or-after' => '2019-12-06T14:17:53Z','renew-until' => '2019-12-06T14:17:53Z','foo' => 'bar','bar' => 'baz'
  }

```

#### Validation
```js
const otk = new OpenToken('mypassword');

const data = otk.validate(token);

//or if we want to validate the subject
const subject = 'Alice';
const data = otk.validate(token,subject);
console.log(data);//bar=be\nfoo=bar
```

<a name="configuration"></a>
#### Configuration

##### Constants
- OpenToken.CIPHER_AES_256_CBC 
- OpenToken.CIPHER_AES_128_CBC 
- OpenToken.CIPHER_DES_TRIPLE_168_CBC             

##### Constructor parameters


| Parameters   |  Value                  | Mandatory  |      Description              |    Default Value           |          
| ------------ | ------------------------|------------|-------------------------------| ---------------------------
| password     | any password            |Yes         |  Password                     |  N/A                       |
| options {}   |  {notAfter, renewUntil, cipher} | No | OpenToken validation Options  |  {notAfter:300, renewUntil:300,OpenToken.CIPHER_AES_256_CBC}|


##### Encoding parameters

`[token]=encode(payload, subject)`

| Argument    | Mandatory | Value                   |  Default |   Description                            | Default value         |
|------------|-----------|---------------------------|-------|---------------------------------|-----------------|
|payload      | Yes        |string                | None |  Raw OpenToken payload                   | N/A             |
|subject      | No        |string                | None |  OpenToken subject to match with                  | N/A             |


`[token]=encodeMap(payload, subject)`

| Argument    | Mandatory | Value                   |  Default |   Description                            | Default value         |
|------------|-----------|---------------------------|-------|---------------------------------|-----------------|
|payload      | Yes        |Map                | None |  Key value map                  | N/A             |
|subject      | No        |string                | None |  OpenToken subject to match with                   | N/A             |

##### Decoding parameters
`[payload]=decode(token)`

| Argument    | Mandatory | Value                   |  Default |   Description                            | Default value         |
|------------|-----------|---------------------------|-------|---------------------------------|-----------------|
|token      | Yes         |string                 | None |  OpenToken payload    | N/A             |


`[payloadAsMap]=decodeAsMap(token)`

| Argument   | Mandatory | Value                   |  Default |   Description                            | Default value         |
|------------|-----------|---------------------------|-------|---------------------------------|-----------------|
|token      | y         |string                 | None |  OpenToken payload as Map       | N/A             |

##### Validate parameters
`[payload]=validate(token,subject)`

| Argument    | Mandatory | Value                   |  Default |   Description                            | Default value         |
|------------|-----------|---------------------------|-------|---------------------------------|-----------------|
|token       | Yes         |string                 | None |  OpenToken payload    | N/A             |
|subject     | No          |string                 | None |  OpenToken subject to match with    | N/A             |
       
<a name="references"></a>
## References
<a name="license"></a>
## License
`@cibel/opentoken` is [MIT licensed](./LICENSE)
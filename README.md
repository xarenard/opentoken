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

#### Import
```js
const OpenToken = require('@cibel/opentoken');

const otk = new OpenToken('mypassword');
```
#### Encoding

```js
// instantiate with pbe password
const otk = new OpenToken('mypassword');
//or instantiate with options
const otk = new OpenToken('mypassword',{notAfter: 300,renewUntil: 300, cipher: OpenToken.CIPHER_AES_256_CBC});


/// Encode from raw payload
const payload = 'bar=be\nfoo=bar';
const token = otk.encode(payload);
console.log(token); //T1RLAQECBByloAOoWT6XlHdV4Vv-Au7BmBDv9j3jjb6jY94w_2uBIedzAAAgsPNMulP3-r07X-S8a3_u9d5EZIvCK_9ujvvEnYk3MSM*

///Or encode from raw payload with subject
const subject = 'mysubject';
const token = otk.encode(payload, subject);
console.log(token); //T1RLAQECBByloAOoWT6XlHdV4Vv-Au7BmBDv9j3jjb6jY94w_2uBIedzAAAgsPNMulP3-r07X-S8a3_u9d5EZIvCK_9ujvvEnYk3MSM*


// Encode from map
const payload =  new Map();
payload.set('bar','be');
payload.set('foo','bar');

const token = otk.encodeMap(payload);
console.log(token);

// Or encoding specific subject
const subject = 'mysubject';
const token = otk.encodeMap(payload, subject );
console.log(token);

```
#### Decoding
```js
const otk = new OpenToken('mypassword');

const data = otk.decode(token);
console.log(data);//bar=be\nfoo=bar

//or

const data = otk.decodeAsMap(token);
console.log(data);// Map { 'bar' => 'be', 'foo' => 'bar' }

```

#### Validation
```js
const otk = new OpenToken('mypassword');


const data = otk.validate(token);

//or if we want to validate the subject
const subjectToBeValidated = 'mysubject';
const data = otk.validate(token,subjectToVBeValidated);

console.log(data);//bar=be\nfoo=bar

```

<a name="configuration"></a>
#### Configuration
##### Constants
- OpenToken.CIPHER_AES_256_CBC 
- OpenToken.CIPHER_AES_128_CBC 
- OpenToken.CIPHER_DES_TRIPLE_168_CBC             

##### Constructor parameters


| Parameters   |  Value                  | Mandatory|      Description|    |Default Value                     |
| ------------ | ------------------------|--------| ----------------------- | ---------------------------
| password     | any password            |Yes     |  Password               |                                 |
| options {}   |  {notAfter, renewUntil, cipher} | No| OpenToken validation Options |   {notAfter:300, renewUntil:300,OpenToken.CIPHER_AES_256_CBC}|


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
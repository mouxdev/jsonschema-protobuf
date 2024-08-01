# jsonschema-protobuf
[![NPM](https://nodei.co/npm/jsonschema-protobuf.png)](https://nodei.co/npm/jsonschema-protobuf/)

Converts [JSON Schema](http://json-schema.org/) to [Protocol Buffers](https://developers.google.com/protocol-buffers).
roughly converts jsonschemas to proto3. Highly specific fork for personal project. i wouldnt recommend you use this.


## Install
```
npm install -g jsonschema-protobuf
```

## Example
```
$ jsonschema-protobuf test.jsonschema
syntax = "proto2";

message person {
  message location {
    optional string city = 1;
    optional string state = 2;
  }

  required string name = 1;
  required int32 age = 2;
  required int32 income = 3;
  optional string universe = 4;
  optional boolean living = 5;
  repeated string alterEgos = 6;
}
```

test.jsonschema
```
{
  "type": "object",
  "name": "person",
  "properties": {
    "name": {"type": "string"},
    "age": {"type": "integer", "min": 0, "max": 120},
    "income": {"type": "number", "min": 0},
    "universe": {"type": "string", "enum": ["Marvel", "DC"]},
    "living": {"type": "boolean", "default": true},
    "alterEgos": {"type": "array", "items": {"type": "string"}},
    "location": {
      "type": "object",
      "properties": {
        "city": {"type": "string"},
        "state": {"type": "string", "regex": "/[A-Z]{2}/"}
      }
    }
  },
  "required": ["name", "age", "income"]
}
```

## JS usage

```js
var convert = require('jsonschema-protobuf')
var jsonschema = fs.readFileSync("test.jsonschema").toString()
var protobuf = convert(jsonschema)
console.log(protobuf)
```

## License
MIT License

Copyright (c) 2024 Moritz Tietze

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

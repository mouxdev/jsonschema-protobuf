#!/usr/bin/env node
var args = process.argv.splice(2)
var convert = require('./')
var fs = require('fs')

var file = args[0]
var go_package = args[1]
var protobuf = convert(fs.readFileSync(file).toString(), go_package)
process.stdout.write(protobuf)
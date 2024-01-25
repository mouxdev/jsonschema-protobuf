var protobuf = require('protocol-buffers-schema')
var mappings = {
  'array': 'repeated',
  'object': 'message',
  'integer': 'int32',
  'number': 'int32',
  'string': 'string',
  'boolean': 'bool'
}

module.exports = function (schema, go_package) {
  if (typeof schema === 'string') schema = JSON.parse(schema)
  var result = {
    syntax: 3,
    package: null,
    enums: [],
    messages: []
  }

  if (schema.type === 'object') {
    result.messages.push(Message(schema))
  }

  recursivelyAddMessagesAsFields(result.messages[0])
  let str = protobuf.stringify(result)
  str = str.replaceAll("required ", "")
  str = str.replaceAll("optional ", "")
  str = str.replaceAll("int32", "double")
  str = str.replaceAll("number", "double")
  let index = str.indexOf(";");
  str = str.slice(0, index + 1) + "\noption go_package = \"" + go_package + "\";\n" + str.slice(index + 1)
  return str
}

function recursivelyAddMessagesAsFields(message) {
  if (message.messages.length > 0) {
    for (const rm of message.messages) {
      recursivelyAddMessagesAsFields(rm)
    }
  }
  let counter = message.fields.length + 1;
  for (const m of message.messages) {
    message.fields.push({
      name: m.name.toLowerCase() + "_",
      repeated: false,
      type: m.name,
      tag: counter
    });
    counter = counter + 1;
  }
}

function Message (schema) {
  var message = {
    name: schema.name,
    enums: [],
    messages: [],
    fields: []
  }

  var tag = 1
  for (var key in schema.properties) {
    var field = schema.properties[key]
    if (field.type === 'object') {
      field.name = key
      message.messages.push(Message(field))
    } else {
      field.name = key
      message.fields.push(Field(field, tag))
      tag += 1
    }
  }

  for (var i in schema.required) {
    var required = schema.required[i]
    for (var i in message.fields) {
      var field = message.fields[i]
      if (required === field.name) field.required = true
    }
  }

  return message
}

function Field (field, tag) {
  var type = mappings[field.type] || field.type
  var repeated = false

  if (field.type === 'array') {
    repeated = true
    type = field.items.type
  }

  return {
    name: field.name,
    type: type,
    tag: tag,
    repeated: repeated
  }
}

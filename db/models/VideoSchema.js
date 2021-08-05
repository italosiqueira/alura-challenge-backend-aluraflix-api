'use strict';

const dynamooseManager = require('../../config/dynamoose');

const schema = new dynamooseManager.Schema(
  {
    "id": {
      "type": String,
      "required": true
    },
    "categoriaId": {
      "type": String,
      "required": true
    },
    "titulo": {
      "type": String,
      "required": true
    },
    "descricao": {
      "type": String,
      "required": true
    },
    "url": {
      "type": String,
      "required": true
    }
  }
);

module.exports = schema;
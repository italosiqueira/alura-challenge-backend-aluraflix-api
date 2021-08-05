'use strict';

const dynamooseManager = require('../../config/dynamoose');

const schema = new dynamooseManager.Schema(
  {
    "id": { 
      "type": String,
      "required": true
    },
    "titulo": { 
      "type": String,
      "required": true
    },
    "cor": {
      "type": String,
      "required": true
    },
  }
);

module.exports = schema;

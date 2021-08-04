'use strict';

const dynamooseManager = require('../../config/dynamoose');

const schema = new dynamooseManager.Schema(
  {
    id: String,
    titulo: String,
    descricao: String,
    url: String
  }
);

module.exports = schema;
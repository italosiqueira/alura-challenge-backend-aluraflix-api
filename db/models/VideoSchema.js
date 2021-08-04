'use strict';

const dynamooseManager = require('../../config/dynamoose');

const schema = new dynamooseManager.Schema(
  {
    id: String,
    categoriaId: String,
    titulo: String,
    descricao: String,
    url: String
  }
);

module.exports = schema;
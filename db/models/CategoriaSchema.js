'use strict';

const dynamooseManager = require('../../config/dynamoose');

const schema = new dynamooseManager.Schema(
  {
    id: String,
    titulo: String,
    cor: String,
  }
);

module.exports = schema;

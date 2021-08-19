'use strict';

const dynamoose = require("dynamoose");

const isLocalDynamoDb = () => { return process.env.DYNAMOOSE_LOCAL; };

if (isLocalDynamoDb()) {
    dynamoose.aws.ddb.local();
}

// Desliga a criação de tabelas a partir dos Schemas por padrão
dynamoose.model.defaults.set({
    "create": false
});

module.exports = dynamoose;
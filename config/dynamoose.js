'use strict';

const dynamoose = require("dynamoose");

// TODO: Implementar configuração dinâmica entre ambiente
const isLocalDynamoDb = () => true;

if (isLocalDynamoDb()) {
    dynamoose.aws.ddb.local();
}

// Desliga a criação de tabelas a partir dos Schemas por padrão
dynamoose.model.defaults.set({
    "create": false
});

module.exports = dynamoose;
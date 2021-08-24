'use strict';

const dynamoose = require("dynamoose");

// Verifica se o modo de execução é local.
// Depende do plugins serverless-offline, que adiciona IS_OFFLINE ao 
// process.env quando executado em modo offline.
const isOffline = () => process.env.IS_OFFLINE;

if (isOffline()) {
    dynamoose.aws.ddb.local();
} else {
    dynamoose.aws.ddb.set(dynamoose.aws.ddb());
}

// Desliga a criação de tabelas a partir dos Schemas por padrão
dynamoose.model.defaults.set({
    "create": false,
    "waitForActive": false
});

module.exports = dynamoose;
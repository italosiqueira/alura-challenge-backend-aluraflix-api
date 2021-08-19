'use strict';

const dynamoose = require("dynamoose");

const isLocalDynamoDb = () => { return process.env.DYNAMOOSE_LOCAL; };

if (isLocalDynamoDb()) {
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
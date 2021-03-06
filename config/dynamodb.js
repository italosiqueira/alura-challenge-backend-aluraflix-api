'use strict'

// Biblioteca de desenvolvimento da AWS
const AWS = require('aws-sdk');

/*
 * Instância de serviço DynamoDB dinâmica (offline vs. remota)
 */
const dynamodbOfflineOptions = {
    region: "localhost",
    endpoint: "http://localhost:8000"
  }
  
  // Verifica se o modo de execução é local.
  // Depende do plugins serverless-offline, que adiciona IS_OFFLINE ao 
  // process.env quando executado em modo offline.
  const isOffline = () => process.env.IS_OFFLINE;
  
  const dynamoDb = isOffline()
    ? new AWS.DynamoDB.DocumentClient(dynamodbOfflineOptions)
    : new AWS.DynamoDB.DocumentClient();

module.exports = dynamoDb;

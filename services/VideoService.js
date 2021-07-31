'use strict'

// Biblioteca de acesso à instância do DynamoDB (local ou remota)
const dynamoDb = require('../config/dynamodb');

const params = {
  // process.env.<nome> refere-se ao valor de 'nome' definido no 'environment' do serverless.yml
  TableName: process.env.VIDEOS_TABLE
};

class VideoService {

  constructor() { }

  async todosVideos() {
    console.log('VideoService::todosVideos');
    return await dynamoDb.scan(params).promise();
  };
  
}

exports.VideoService = VideoService;
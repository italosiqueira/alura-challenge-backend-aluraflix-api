'use strict';

// Biblioteca de desenvolvimento da AWS
const AWS = require('aws-sdk');
// Biblioteca de manipulação de tempo
const moment = require('moment');
// Biblioteca para gerar identificadores únicos
const { nanoid } = require('nanoid');

class Video { 
  constructor(id, titulo, descricao, url) {
    this.id = id;
    this.titulo = titulo;
    this.descricao = descricao;
    this.url = url;
  }
};

function isVideoValido(video) {
  if (video.titulo && video.descricao && video.url) {
    return true;
  }

  return false;
}

/*
 * Instância de serviço DynamoDB dinâmica (offline vs. remota)
 */
const dynamodbOfflineOptions = {
  region: "localhost",
  endpoint: "http://localhost:8000"
}

const params = {
  // process.env.<nome> refere-se ao valor de 'nome' definido no 'environment' do serverless.yml
	TableName: process.env.VIDEOS_TABLE
}

// Verifica se o modo de execução é local
const isOffline = () => process.env.IS_OFFLINE;

const dynamoDb = isOffline()
  ? new AWS.DynamoDB.DocumentClient(dynamodbOfflineOptions)
  : new AWS.DynamoDB.DocumentClient();

module.exports.hello = async (event) => {
  return {
    statusCode: 200,
    body: JSON.stringify(
      {
        message: 'Go Serverless v1.0! Your function executed successfully!',
        input: event,
      },
      null,
      2
    ),
  };
};

module.exports.listarVideos = async (event) => {

  try {
    // Método do DynamoDB para busca de informações a partir dos parâmetros
    let videos = await dynamoDb.scan(params).promise();

    return {
      statusCode: 200,
      body: JSON.stringify(
        videos.Items,
        null,
        2
      ),
    };
  } catch (err) {
    console.log("Error", err);
    return {
      statusCode: err.statusCode ? err.statusCode : 500,
      body: JSON.stringify({
        error: err.name ? err.name : "Exception",
        message: err.message ? err.message : "Unknown error",
      }),
    };
  }
};

module.exports.obterVideo = async (event) => {
  
  // extrai os dados de parâmetro na URL
  const { videoId } = event.pathParameters;

  try {

    /* 
     * Método do DynamoDB para obter um registro específico a partir 
     * da Partition Key (Chave Primária)
     */
    let data = await dynamoDb.get({
        ... params, 
        Key: { 
          id: videoId 
        }
    }).promise();

    const video = data.Item;

    // Se video não for válido
    if(!video) {
      return {
        statusCode: 404,
        body: JSON.stringify(
          {
            error: "Vídeo não existe"
          },
          null,
          2
        )
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify(
        video,
        null,
        2
      )
    };

  } catch (err) {
    console.log("Error", err);
    
    return {
      statusCode: err.statusCode ? err.statusCode : 500,
      body: JSON.stringify({
        error: err.name ? err.name : "Exception",
        message: err.message ? err.message : "Unknown error",
      }),
    };
  }
};

module.exports.criarVideo = async (event) => {

  try {
    // extrai os dados do corpo da requisição
    let data = JSON.parse(event.body);

    const { titulo, descricao, url } = data;
    
    let video = new Video(nanoid(), titulo, descricao, url);

    if (!isVideoValido(video)) {
      throw({ 
        statusCode: 400, 
        name: 'MissingParameterException', 
        message: 'One or more parameters are missing' });
    }

    /* 
     * Método do DynamoDB para gravar informações na base de dados
     */
    await dynamoDb.put({
        ... params, 
        Item: video
    }).promise();

    return {
      statusCode: 201,
      body: JSON.stringify(
        video,
        null,
        2
      )
    };

  } catch (err) {
    return {
      statusCode: err.statusCode ? err.statusCode : 500,
      body: JSON.stringify({
        error: err.name ? err.name : "Exception",
        message: err.message ? err.message : "Unknown error",
      }),
    };
  }
};

module.exports.atualizarVideo = async (event) => {

  // extrai os dados de parâmetro na URL
  const { videoId } = event.pathParameters;
  
  try {

    // extrai os dados do corpo da requisição
    let data = JSON.parse(event.body);

    const { titulo, descricao, url } = data;
    
    let video = new Video(videoId, titulo, descricao, url);

    if (!isVideoValido(video)) {
      throw({ 
        statusCode: 400, 
        name: 'MissingParameterException', 
        message: 'One or more parameters are missing' });
    }

    /* 
     * Método do DynamoDB para atualizar informações na base de dados
     */
    await dynamoDb.update({
        ... params, 
        Key: {
          id: video.id
        },
        /* 
         * UpdateExpression utiliza uma Expression Syntax do DynamoDB (como um SQL).
         * 
         * Informa os campos que serão atualizados e os novos valores (a serem 
         * substituídos na expressão).
         */
        UpdateExpression: 'SET titulo = :titulo, descricao = :descricao, #u = :url',
        /* 
         * ConditionExpression utiliza uma Expression Syntax do DynamoDB (como um SQL).
         * 
         * Seria como a nossa cláusula WHERE , indicando uma condição a ser satisfeita.
         * Sem esta condição, não seria possível tratar os casos onde não há paciente com
         * o identificador informado.
         */
        ConditionExpression: 'attribute_exists(id)',
        /* 
        * ExpressionAttributeValues utiliza uma Expression Syntax do DynamoDB.
        * 
        * Especificao os placeholders que podem ser utilizados pela UpdateExpression
        * acima e os seus valores.
        */
        ExpressionAttributeValues: {
          ':titulo' : video.titulo,
          ':descricao' : video.descricao,
          ':url' : video.url
        },
        ExpressionAttributeNames: {
          '#u': 'url'
        }
    }).promise();

    return {
      statusCode: 200,
      body: JSON.stringify(
        video,
        null,
        2
      )
    };

  } catch (err) {

    let error = err.name ? err.name : "Exception";
    let message = err.message ? err.message : "Unknown error";
    let statusCode = err.statusCode ? err.statusCode : 500;
    
    if (error == 'ConditionalCheckFailedException') {
      error = 'ItemNotFoundException';
      message = `Recurso com o ID ${videoId} não existe e não pode ser atualizado`;
      statusCode = 404;
    }

    return {
      statusCode,
      body: JSON.stringify({
        error,
        message,
      }),
    };
  }
};

module.exports.removerVideo = async (event) => {

  // extrai os dados de parâmetro na URL
  const { videoId } = event.pathParameters;
  
  try {
    
    /* 
     * Método do DynamoDB para remover informações na base de dados
     */
    await dynamoDb.delete({
        ... params, 
        Key: {
          id: videoId
        },
        /* 
         * ConditionExpression utiliza uma Expression Syntax do DynamoDB (como um SQL).
         * 
         * Seria como a nossa cláusula WHERE , indicando uma condição a ser satisfeita.
         * Sem esta condição, não seria possível tratar os casos onde não há paciente com
         * o identificador informado.
         */
        ConditionExpression: 'attribute_exists(id)'
    }).promise();

    return {
      statusCode: 200,
      body: JSON.stringify(
        `Recurso com o ID ${videoId} removido`,
        null,
        2
      )
    };

  } catch (err) {

    let error = err.name ? err.name : "Exception";
    let message = err.message ? err.message : "Unknown error";
    let statusCode = err.statusCode ? err.statusCode : 500;
    
    if (error == 'ConditionalCheckFailedException') {
      error = 'ItemNotFoundException';
      message = `Recurso com o ID ${videoId} não existe e não pode ser removido`;
      statusCode = 404;
    }

    return {
      statusCode,
      body: JSON.stringify({
        error,
        message,
      }),
    };
  }
};

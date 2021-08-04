'use strict';

// Biblioteca de acesso à instância do DynamoDB (local ou remota)
const dynamoDb = require('./config/dynamodb');
// Biblioteca de manipulação de tempo
const moment = require('moment');
// Biblioteca para gerar identificadores únicos
const { nanoid } = require('nanoid');

const { VideoService } = require('./services/VideoService');
const { CategoriaService } = require('./services/CategoriaService');

const videoServiceInstance = new VideoService();
const categoriaServiceInstance = new CategoriaService();

const params = {
  // process.env.<nome> refere-se ao valor de 'nome' definido no 'environment' do serverless.yml
    TableName: process.env.VIDEOS_TABLE
}

function isVideoValido(video) {
  if (video.titulo && video.descricao && video.url) {
    return true;
  }

  return false;
}

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

module.exports.listarCategorias = async (event) => {
  try {
    let categorias = await categoriaServiceInstance.listarTodos();

    return {
      statusCode: 200,
      body: JSON.stringify(
        categorias,
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

module.exports.obterCategoria = async (event) => {
  
  // extrai os dados de parâmetro na URL
  const { categoriaId } = event.pathParameters;

  try {

    let categoria = await categoriaServiceInstance.obter(categoriaId);
    
    // Se catagoria não for válida
    if(!categoria) {
      return {
        statusCode: 404,
        body: JSON.stringify(
          {
            error: "Não encontrado."
          },
          null,
          2
        )
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify(
        categoria,
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

module.exports.criarCategoria = async (event) => {
  try {
    // extrai os dados do corpo da requisição
    let data = JSON.parse(event.body);

    const { titulo, cor } = data;

    let categoria = await categoriaServiceInstance.criar({ titulo, cor });

    return {
      statusCode: 201,
      body: JSON.stringify(
        categoria,
        null,
        2
      )
    };

  } catch (err) {

    let error = err.name ? err.name : "Exception";
    let message = err.message ? err.message : "Unknown error";
    let statusCode = (error == 'MissingParameterException') ? 400 : 500;

    return {
      statusCode,
      body: JSON.stringify({
        error,
        message
      }),
    };
  }
};

module.exports.atualizarCategoria = async (event) => {
  // extrai os dados de parâmetro na URL
  const { categoriaId } = event.pathParameters;
  
  try {

    // extrai os dados do corpo da requisição
    let data = JSON.parse(event.body);

    const { titulo, cor } = data;
    
    let categoria = await categoriaServiceInstance.atualizar(categoriaId, { titulo, cor });

    return {
      statusCode: 200,
      body: JSON.stringify(
        categoria,
        null,
        2
      )
    };

  } catch (err) {

    let error = err.name ? err.name : "Exception";
    let message = err.message ? err.message : "Unknown error";
    let statusCode = (error == 'MissingParameterException') ? 400 : 500;
    
    if (error == 'ConditionalCheckFailedException') {
      error = 'ItemNotFoundException';
      message = `Recurso com o ID ${categoriaId} não existe e não pode ser atualizado`;
      statusCode = 404;
    }

    return {
      statusCode,
      body: JSON.stringify({
        error,
        message
      }),
    };
  }
};

module.exports.removerCategoria = async (event) => {
  
  // extrai os dados de parâmetro na URL
  const { categoriaId } = event.pathParameters;
  
  try {
    
    await categoriaServiceInstance.remover(categoriaId);

    return {
      statusCode: 200,
      body: JSON.stringify(
        `Recurso com o ID ${categoriaId} removido`,
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
      message = `Recurso com o ID ${categoriaId} não existe e não pode ser removido`;
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

module.exports.listarVideos = async (event) => {

  try {
    const titulo = event.queryStringParameters ? 
      event.queryStringParameters.titulo : 
      undefined;
    
    console.log(titulo);
    
    let videos = 
      (titulo) ? 
        await videoServiceInstance.listarPorTitulo(titulo) : 
        await videoServiceInstance.listarTodos();

    return {
      statusCode: 200,
      body: JSON.stringify(
        videos,
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

    let video = await videoServiceInstance.obter(videoId);

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

    const { categoriaId, titulo, descricao, url } = data;
    
    let video = await videoServiceInstance.criar({ categoriaId, titulo, descricao, url });

    return {
      statusCode: 201,
      body: JSON.stringify(
        video,
        null,
        2
      )
    };

  } catch (err) {
    
    let error = err.name ? err.name : "Exception";
    let message = err.message ? err.message : "Unknown error";
    let statusCode = (error == 'MissingParameterException') ? 400 : 500;
    
    return {
      statusCode,
      body: JSON.stringify({
        error,
        message
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

    const { categoriaId, titulo, descricao, url } = data;
    
    let video = await videoServiceInstance.atualizar(videoId, { categoriaId, titulo, descricao, url });

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
    let statusCode = (error == 'MissingParameterException') ? 400 : 500;
    
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
    
    await videoServiceInstance.remover(videoId);
    
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

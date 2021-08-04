'use strict'

// Biblioteca para gerar identificadores únicos
const { nanoid } = require('nanoid');

const VideoRepository = require('../db/models/VideoRepository');

class VideoService {

  constructor() {
    this.model = new VideoRepository();
  }

  isVideoValido(video) {
    if (video.categoriaId && video.titulo && video.descricao && video.url) {
      return true;
    }
  
    return false;
  }

  listarTodos() {
    return this.model.findAll();
  };

  async criar(item) {

    let video = { "id": nanoid(), ... item };

    if (!this.isVideoValido(video)) {
      let messages = [];
      for (var field in video) {
        if (!video[field]) {
          messages.push(`O campo ${field} é obrigatório.`);
        }
      }

      throw({ 
        name: 'MissingParameterException', 
        message: messages });
    }

    await this.model.create(video);

    return video;
  }

  async obter(id) {
    let documento = await this.model.findOne(id);
    return (documento) ? documento.serialize() : documento;
  }

  async atualizar(key, item) {

    let video = { "id": key, ... item };
    
    if (!this.isVideoValido(video)) {
      let messages = [];
      for (var field in video) {
        if (!video[field]) {
          messages.push(`O campo ${field} é obrigatório.`);
        }
      }

      throw({ 
        name: 'MissingParameterException', 
        message: messages });
    }

    let documento = await this.model.update(
        { 'id': video.id }, 
        { 'categoriaId': video.categoriaId, 'titulo': video.titulo, 'descricao': video.descricao, 'url': video.url });
    
        return (documento) ? documento.serialize() : documento;
  }

  async remover(id) {
      await this.model.delete(id);
  }
}

exports.VideoService = VideoService;
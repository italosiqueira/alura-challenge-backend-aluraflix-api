'use strict';

// Biblioteca para gerar identificadores únicos
const { nanoid } = require('nanoid');

const CategoriaRepository = require('../db/models/CategoriaRepository');

class CategoriaService {
  
  constructor() {
    this.model = new CategoriaRepository();
  }
  
  isCategoriaValida(categoria) {
    if (categoria.titulo && categoria.cor) {
      return true;
    }
  
    return false;
  }

  listarTodos() {
    return this.model.findAll();
  }

  async criar(item) {

    let categoria = { "id": nanoid(), "titulo": item.titulo, "cor": item.cor };

    console.log('CategoriaService::criar::item: ', categoria);

    if (!this.isCategoriaValida(categoria)) {
      throw({ 
        name: 'MissingParameterException', 
        message: 'One or more parameters are missing' });
    }

    await this.model.create(categoria);

    return categoria;
  }

  async obter(id) {
    let documento = await this.model.findOne(id);
    return (documento) ? documento.serialize() : documento;
  }
}

exports.CategoriaService = CategoriaService;

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

    if (!this.isCategoriaValida(categoria)) {
      let messages = [];
      for (var field in categoria) {
        if (!categoria[field]) {
          messages.push(`O campo ${field} é obrigatório.`);
        }
      }

      throw({ 
        name: 'MissingParameterException', 
        message: messages });
    }

    await this.model.create(categoria);

    return categoria;
  }

  async obter(id) {
    let documento = await this.model.findOne(id);
    return (documento) ? documento.serialize() : documento;
  }

  async atualizar(key, item) {

    let categoria = { "id": key, ... item };
    
    if (!this.isCategoriaValida(categoria)) {
      let messages = [];
      for (var field in categoria) {
        if (!categoria[field]) {
          messages.push(`O campo ${field} é obrigatório.`);
        }
      }

      throw({ 
        name: 'MissingParameterException', 
        message: messages });
    }
    
    let documento = await this.model.update(
        { 'id': categoria.id }, 
        { 'titulo': categoria.titulo, 'cor': categoria.cor });
    
        return (documento) ? documento.serialize() : documento;
  }

  async remover(id) {
      await this.model.delete(id);
  }
}

exports.CategoriaService = CategoriaService;

'use strict';

const BaseRepository = require('./BaseRepository');
const categoriaSchema = require('./CategoriaSchema');

class CategoriaRepository extends BaseRepository {
    constructor() {
        super({ tableName: process.env.CATEGORIAS_TABLE, schema: categoriaSchema});
    }
}

module.exports = CategoriaRepository;

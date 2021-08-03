'use strict';

const dynamooseManager = require('../../config/dynamoose');

class BaseRepository {
    
    constructor({ tableName, schema }) {
        this.model = dynamooseManager.model(tableName, schema);
    }

    create(item) {
        return this.model.create(item);
    }

    findOne(id) {
        return this.model.get(id);
    }

    findAll() {
        return this.model.scan().exec();
    }

    delete(id) {

    }
}

module.exports = BaseRepository;
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

    async findAll(page) {
        if (page) {
            return this.findAllPaged(page);
        }
        return this.model.scan().exec();
    }

    async findAllPaged(pageNumber, size = 5) {

        if (pageNumber <= 0) {
            return [];
        }
        
        // First page, no lastKey for use
        let currentPage = 0;
        let response = await this.model.scan().limit(size).exec();

        while (++currentPage < pageNumber && response.lastKey != undefined) {
            response = await this.model.scan().startAt(response.lastKey).limit(size).exec();
        }

        return (currentPage == pageNumber) ? response : [];
    }

    async queryAll(queryKey, queryValue, strictMode = false) {

        const conditionalQuery = strictMode ? 
            this.model.scan(queryKey).eq(queryValue) :
            this.model.scan(queryKey).contains(queryValue);
        
        return conditionalQuery.exec();
    }

    update(keyObject, modelObject) {
        let hashKeyName = this.model.getHashKey();
        return this.model.update(keyObject, modelObject, {
            "condition": new dynamooseManager.Condition(hashKeyName).exists()
        });
    }

    delete(id) {
        let hashKeyName = this.model.getHashKey();
        return this.model.delete(id, { 
            "condition": new dynamooseManager.Condition(hashKeyName).exists() 
        });
    }
}

module.exports = BaseRepository;
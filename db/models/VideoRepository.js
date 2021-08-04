'use strict';

const BaseRepository = require('./BaseRepository');
const videoSchema = require('./VideoSchema');

class VideoRepository extends BaseRepository {
    constructor() {
        super({ tableName: process.env.VIDEOS_TABLE, schema: videoSchema});
    }
}

module.exports = VideoRepository;
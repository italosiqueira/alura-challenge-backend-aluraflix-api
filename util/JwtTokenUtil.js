'use strict';

const jwt = require("jsonwebtoken");

module.exports.verify = (token) => {
    return jwt.verify(token, process.env.JWT_SECRET);
}

module.exports.sign = (payload) => {
    const token = jwt.sign(payload, process.env.JWT_SECRET);
    return token;
}
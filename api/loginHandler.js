'use strict';

const querystring = require('querystring');
const { LoginService } = require("../services/LoginService");
const base64url = require('base64url');

const loginServiceInstance = new LoginService();

module.exports.login = async (event) => {
    
    try {
        
        // extrai os dados do corpo da requisição
        const body = event.headers['x-forwarded-proto'] === 'https' ? 
                        base64url.decode(event.body) : event.body;
        let data = querystring.parse(body);
        const { email, senha } = data;
        
        const token = loginServiceInstance.login(email, senha);
        
        return {
            statusCode: 204,
            headers: {
                "Authorization": token,
                "Access-Control-Allow-Credentials" : true // Required for cookies, authorization headers with HTTPS 
            },
            body: ""
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
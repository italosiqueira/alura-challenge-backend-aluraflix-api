'use strict';

const querystring = require('querystring');
const { LoginService } = require("../services/LoginService");

const loginServiceInstance = new LoginService();

module.exports.login = async (event) => {
    
    try {
        // extrai os dados do corpo da requisição
        let data = querystring.parse(event.body);

        const { email, senha } = data;

        console.log(event);
        console.log(`[email]: ${email}`);
        console.log(`[senha]: ${senha}`);

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
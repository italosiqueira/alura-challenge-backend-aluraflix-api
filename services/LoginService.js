'use strict';

const jwtUtil = require('../util/JwtTokenUtil');

class LoginService {

    login(email, senha) {

        if (!email || !senha) {
            let messages = [];
            
            if (!email) {
                messages.push('O campo \"email\" é obrigatório.');
            }

            if (!senha) {
                messages.push('O campo \"senha\" é obrigatório.');
            }
            
            throw({ 
                name: 'MissingParameterException', 
                message: messages }
            );
        }

        const payload = {
            email,
            senha
        };
        
        return jwtUtil.sign(payload);
    }
}

exports.LoginService = LoginService;
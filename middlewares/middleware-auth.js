const jwtUtil = require('../util/JwtTokenUtil');

// Função auxiliar
const generatePolicy = (principalId, effect, resource) => {
  const authResponse = {};

  authResponse.principalId = principalId;
  if (effect && resource) {
    const policyDocument = {};
    policyDocument.Version = "2012-10-17";
    policyDocument.Statement = [];
    const statementOne = {};
    statementOne.Action = "execute-api:Invoke";
    statementOne.Effect = effect;
    statementOne.Resource = resource;
    policyDocument.Statement[0] = statementOne;
    authResponse.policyDocument = policyDocument;
  }

  return authResponse;
};

module.exports.auth = (event, context, callback) => {
  
  let authorizationToken;
  
  if (!event.authorizationToken) {
    if (!event.headers || !event.headers['authorization']) {
      // Token não enviado
      console.log('HEADER authorization and PROPERTY authorizationToken not found!');
      return callback('Unauthorized');
    }
    console.log(`Found HEADER authorization - type ${event.type}.`)
    authorizationToken = event.headers['authorization'];
  } else {
    console.log(`Found PROPERTY authorizationToken - type ${event.type}.`)
    authorizationToken = event.authorizationToken;
  }
  
  const tokenParts = authorizationToken.split(' ');
  const tokenValue = tokenParts[1];
  
  if (!(tokenParts[0].toLowerCase() === 'bearer' && tokenValue)) {
    // Token correto não encontrado
    return callback('Unauthorized');
  }

  // Verifica o token (basicamente o decodifica). Se existir uma data limite para
  // expiração, também é verificada aqui.
  try {
    const decoded = jwtUtil.verify(tokenValue);

    /*
     * Opcionalmente aqui poderia ser verificado se as informações
     * presentes em nosso payload existem no sistema, isto é,
     * estão presentes em uma tabela ou satisfazem outro critério.
     */
    
    return callback(null, generatePolicy(decoded.email, "Allow", event.methodArn));
  } catch(erro) {
    return callback('Unauthorized');
  }
};

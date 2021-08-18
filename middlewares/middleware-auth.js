const jwt = require("jsonwebtoken");

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
  console.log('event', event);
  
  if (!event.authorizationToken) {
    // Token não enviado
    return callback('Unauthorized');
  }

  const tokenParts = event.authorizationToken.split(' ');
  const tokenValue = tokenParts[1];

  if (!(tokenParts[0].toLowerCase() === 'bearer' && tokenValue)) {
    // Token correto não encontrado
    return callback('Unauthorized');
  }

  // Verifica o token (basicamente o decodifica). Se existir uma data limite para
  // expiração, também é verificada aqui.
  try {
    const decoded = jwt.verify(tokenValue, process.env.JWT_SECRET);
    console.log(`[decoded]: ${decoded}`);
    
    /*
     * Opcionalmente aqui poderia ser verificado se as informações
     * presentes em nosso payload existem no sistema, isto é,
     * estão presentes em uma tabela ou satisfazem outro critério.
     */
    
    return callback(null, generatePolicy(decoded.principalId, "Allow", event.methodArn));
  } catch(erro) {
    return callback('Unauthorized');
  }
};

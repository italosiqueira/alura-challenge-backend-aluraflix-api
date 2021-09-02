# AluraFlix Backend API Rest

Este é o projeto da API Rest do Challange Back End da Alura. #alurachallengeback

# Sobre o projeto

Basicamente, este projeto busca fornecer os serviços de *backend* de uma nova **plataforma de compartilhamento de vídeos**. A plataforma deve permitir ao usuário montar playlists com links para seus vídeos preferidos, separados por categorias.

As principais funcionalidades a serem implementadas são:

1. **API com rotas implementadas segundo o padrão REST**;
2. **Validações feitas conforme as regras de negócio**;
3. **Implementação de base de dados para persistência das informações**;
4. **Serviço de autenticação para acesso às rotas GET, POST, PUT e DELETE**.

O projeto terá uma duração de 4 semanas, onde a cada semana teremos atividades específicas a serem desenvolvidas. A última semana será dedicada a resolver quaisquer tarefas pendentes ou realizar ajustes.

# Ambiente de desenvolvimento:

- Windows 10: o SO da máquina de desenvolvimento;
- NodeJS: Para rodar o projeto em Back End;
- Framework Serverless: para gerenciar o ciclo de vida da aplicação e *deploy* na nuvem;
- Amazon AWS: responsável por nossa infraestrutura na nuvem (e total integração com Serverless Framework);
- DynamoDB: o DynamoDB é o banco de dados NoSQL da Amazon AWS.

Todo este *stack* de desenvolvimento é novidade para mim, e até o momento a escolha de uma arquitetura *serverless*, junto com NodeJS, é uma tentativa de aprender novas tecnologias. O banco de dados NoSQL veio de brinde durante os estudos da arquitetura.

Lembrem-se que em situações reais a escolha das tecnologias a serem utilizadas vai requerer uma análise mais profunda do negócio e ambiente corporativo. Neste caso, a análise girou em torno do meu aprendizado!

# Como o Projeto Funciona?

O projeto é feito sobre o *framework* [Serverless Framework](https://www.serverless.com) com [NodeJS](https://nodejs.org), em conjunto com o Banco de Dados NoSQL [DynamoDB](https://aws.amazon.com/pt/dynamodb).

Para as rotas, o *Serverless Framework* utiliza os serviços da *Amazon API Gateway*, com nosso código (as funções) executando em instâncias da *AWS Lambda*.

Por enquanto não estamos realizando o *deploy* na nuvem, mas rodando localmente nossa API, juntamente com uma instância local do DynamoDB que é inicializada *on-demand*.

Para instalar as dependências do projeto:

```bash
npm install
```

Em seguida, a biblioteca e *plugin* para utilização da instância local do DynamoDB:

```bash
serverless plugin install --name serverless-dynamodb-local
sls dynamodb install
```

Finalmente, para subir localmente nossa API:

```bash
sls offline start
```

# Deploy

Como mencionado no começo do README, este projeto foi feito tendo em mente o *deploy* da nuvem da Amazon, a [AWS](https://aws.amazon.com/pt/). Supondo que o ambiente foi configurado de acordo com as instruções aqui presentes, basta executar o seguinte comando para disponibilizar a sua API na AWS:

```bash
sls deploy --stage release
```

A sua API será disponibilizada no caminho:

```
https://<aws-id>.execute-api.<region>.amazonaws.com/<stage>
```

onde

- \<aws-id\>: identificador atribuído pela AWS ao seu API Gateway;
- \<region\>: a região da AWS indicada por você, ou conforme definida nas configurações do projeto (_serverless.yml_);
- \<stage\>: o estágio do seu projeto para o qual vocês deseja implantar, indicada por você ou conforme definida nas configurações do projeto (_serverless.yml_).

Você pode perguntar ao _framework_ se há um _release_ já disponibilizado com o seguinte comando:

```bash
sls info --stage release
```

## Remoto vs. Local

Encontrei as seguintes diferenças ao realizar o _deploy_ entre os serviços local e remoto:

1. **query string**: como a API é disponibilizada com o protocolo seguro HTTPS, ao enviarmos nossos parâmetros codificados via URL (ver [loginHandler.js](api/loginHandler.js)), devemos decodificar as informações via _base64url_. Em um ambiente não seguro, esta decodificação não é necessária. Deste modo, verificamos o protocolo da requisição via cabeçalho _x-forwarded-proto_;
2. **cabeçalho `Authorization`** nas reposta: o API Gateway impõe certas restrições e limitações ao lidar com métodos com a integração do Lambda (utilizado aqui) ou a integração HTTP. Dentre estas limitações, está o cabeçalho de resposta `Authorization`, utilizado para retornar o _token_ JWT ao cliente, sendo remapeado para `x-amzn-remapped-authorization`. Este problema é do interesse de qualquer _front-end_ que deseje consumir nossa API. Não consegui encontrar uma solução adequada para esta questão. Maiores informações podem ser encontradas [aqui](https://docs.aws.amazon.com/pt_br/apigateway/latest/developerguide/api-gateway-known-issues.html).

# Testes

Os testes da API Rest podem ser feitos pelo utilitário de linha de comando `curl` ou por um aplicativo de cliente de APIs. Optamos por esta última opção, utilizando o [Insomnia](https://insomnia.rest/). Os projeto do _Insomnia_ está configurado somente para testes de integração locais.

# Segunração com JWT

A autenticação _de-facto_ do usuário não existe, somente obrigamos o envio de parâmetros específicos pelo método de _login_ para gerar um _token_ válido para a API. Os _tokens_ também podem ser gerados (e validados) em https://jwt.io/, sendo necessário fornecer somente os parâmetros já mencionados e a sua chave secreta.

# Melhorias

Algumas funcionalidades ou atividades ficaram de fora:

1. testes unitários: não tive tempo de estudar um _framework_ de testes unitários (em compensação, estudamos testes de integração na plataforma _Insomnia_ e o padrão _OpenAPI_);
2. utilizar os métodos `query` do _DynamoDB_: é necessário definir adequadamente nossos _schemas_ no _framework_ de modelagem _Dynamoose_ para utilizar o método de consulta `query`, mais performático, em todas as consultas;
3. integrar os parâmetros `page` e `titulo`: podemos realizar consultas paginadas e consultas a partir de um termo no título dos vídeos, mas não conseguimos realizar as duas ao mesmo tempo (paginação de uma consulta por vídeos a partir do título, ver item anterior);
4. implementar mecanismo para ligar ou desligar a autenticação/autorização para utilizar a API (útil para brincar com a integração com o _front-end_ do [Aluraflix](https://github.com/alura-cursos/aluraflix-front));
5. integrar a solução de autenticação ao [AWS Cognito](https://aws.amazon.com/pt/cognito/) ou realizar a implementaçao de um CRUD para usuários;
6. refatorar completamente a estrutura do projeto segundo os melhores padrões.

<br/>
<p style="text-align: center;">
    <img src="https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=black" alt="JavaScript">
    <img src="https://img.shields.io/badge/Node.js-43853D?logo=node.js&logoColor=white" alt="NodeJS">
    <img src="https://img.shields.io/badge/Serverless-red?logo=serverless&logoColor=white" alt="Serverless">
    <img src="https://img.shields.io/badge/Amazon_AWS-232F3E?logo=amazon-aws&logoColor=white" alt="AWS">
    <img src="https://img.shields.io/badge/DynamoDB-232F3E?logo=amazon-dynamodb&logoColor=white" alt="DynamoDB">
    <img src="https://img.shields.io/badge/Markdown-000000?logo=markdown&logoColor=white" alt="Markdown">
</p>

<p style="text-align: center;">
    <img src="https://img.shields.io/badge/Windows-0078D6?logo=windows&logoColor=white" alt="Windows 10 21H1">
    <img src="https://img.shields.io/badge/NVIDIA-GTX1050_TI-76B900?logo=nvidia&logoColor=white" alt="Nvidia GTX1050 Ti">
    <img src="https://img.shields.io/badge/Intel-Core_i7_7th-0071C5?logo=intel&logoColor=white" alt="Intel i7">
</p>

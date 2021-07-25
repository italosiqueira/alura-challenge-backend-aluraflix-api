# AluraFlix Backend API Rest

Este é o projeto da API Rest do Challange Back End da Alura.

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

# Testes

Os testes da API Rest podem ser feitos pelo utilitário de linha de comando `curl` ou por um aplicativo de cliente de APIs. Optamos por esta última opção, utilizando o [Insomnia](https://insomnia.rest/).

Em breve os testes unitários serão disponibilizados.

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
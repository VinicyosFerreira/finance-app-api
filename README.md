
# 📝 Finance App
Finance App é um API REST robusta, utilizada para gerenciamento de finanças.
## 🚀 Tecnologias

**Node.js**: Execução do runtime da aplicação do backend.

**Express.js**: Implementação de rotas e middlewares para 
construção do servidor http.

**PostgresSQL** Banco de dados utilizado.

**Prisma ORM**: Ferramenta para interação com banco, permitindo manipulação SQL de forma simplificada.

**Docker**: Criação e orquestração de containers para o banco de dados.

**Jest**: Realizar a testagem completa da API.
## 📁 Estrutura do Projeto

```

.github/          # Pipeline CI/CD 
.husky/           # Scripts para Git Hooks
docs/             # Documentação em Swagger
prisma/           # Setup do Prisma(schema e client)
src/
├── adapters/     # Classes adapters para libs externas
├── controllers/  # Camada que lida com request,validações e erros.
├── errors/       # Criação de erros personalizados 
├── factories/    # Centraliza instâncias de objetos
├── repositories/ # Camada que lida com fonte de dados
├── routes/       # Implementação das rotas http
├── schemas/      # Schema do Zod
├── tests/        # Objetos fixos pré configurados afim de testes
├── use-cases/    # Camada que lida com regra de negócios
```
## 📄 Documentação ##
O projeto contém uma documentação da **API com Swagger** que pode ser acessado localmente, se realizar o clone do projeto na rota /docs

**http://localhost:8080/docs**

## 🗺️ Explorando o código

- Aplicação dividida em 3 camadas separando em **controllers,use case e repository**, garantindo que cada camada se comunique através de Injeção de Dependência.
- Implementação de **adapter (Design Pattern)**, isolando nossa aplicação de libs externas, tornando a aplicação mais segura à possiveis atualizações de depedências.
- Criação de **factories (Design Pattern)**, permitindo que objetos sejam criados em único lugar, garantindo um baixo acoplamento e eliminando instância direta entre módulos. 
- Criação de schemas com Zod permitindo o reuso de lógica nos controllers para validação de dados, álem de erros personalizados para melhorar a comunicação de respostas para usuário final.
- Desenvolvimento de pipelines CI/CD, promevendo a automação de checagem de código, migração do prisma e deploy da API para produção.
## 🔍 Qualidade do código 
- Desenvolvimento de testes unitários de cada módulo, utilizando Jest e supertest, garantindo mais de 150 teste e uma cobertura de 97%, isso garante um segurança absurda na checagem e validação das funcionalidades da aplicação
- Implementação de testes unitários, integração e E2E, abrangendo um volume completo de testagem.
- Também foi utilizado Prettier,Eslint e Husky para garantir a padronização no código e no tratamento de commits, evitando que seja enviado commits de forma errada ou que cause algum problema.

## 📦 Como rodar localmente 

**Clonar projeto**

**git clone** https://github.com/VinicyosFerreira/finance-app-api

**Acessar pasta**

cd finance-app-api

**Instalar dependências**

npm install

**Docker**

docker compose up -d 

**Prisma**

npx prisma migrate dev

**Rodar projeto localmente**

npm run start:dev

**Rodar teste**

npm run test | npm run test:watch
## 🔗 Links 

**Código Fonte** [Confira o código fonte]
https://github.com/VinicyosFerreira/finance-app-api
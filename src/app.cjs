const express = require('express');
const { usersRouter, transactionsRouter } = require('./routes/index.js');
const swaggerUi = require('swagger-ui-express');
const path = require('path');
const fs = require('fs');

const app = express();
app.use(express.json());

app.use('/api/users', usersRouter);
app.use('/api/transactions', transactionsRouter);
const swaggerDocument = JSON.parse(
  fs.readFileSync(path.join(__dirname, '../docs/swagger.json'), 'utf-8')
);
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

module.exports = { app };

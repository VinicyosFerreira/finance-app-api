import 'dotenv/config';
import express from 'express';
import process from 'process';

import {
  makeCreateUserController,
  makeDeleteUserController,
  makeGetUserByIdController,
  makeUpdateUserController,
} from './src/factories/controllers/user.js';

import { makeCreateTransactionController } from './src/factories/controllers/transaction.js';

const app = express();
app.use(express.json());
const port = process.env.PORT;

app.post('/api/users', async (req, res) => {
  const createUserController = makeCreateUserController();
  const { statusCode, body } = await createUserController.execute(req);
  res.status(statusCode).json(body);
});

app.get('/api/users/:userId', async (req, res) => {
  const getUserByIdController = makeGetUserByIdController();
  const { statusCode, body } = await getUserByIdController.execute(req);
  res.status(statusCode).json(body);
});

app.patch('/api/users/:userId', async (req, res) => {
  const updateUserController = makeUpdateUserController();
  const { statusCode, body } = await updateUserController.execute(req);
  res.status(statusCode).json(body);
});

app.delete('/api/users/:userId', async (req, res) => {
  const deleteUserController = makeDeleteUserController();
  const { statusCode, body } = await deleteUserController.execute(req);
  res.status(statusCode).json(body);
});

app.post('/api/transactions', async (req, res) => {
  const createTransactionController = makeCreateTransactionController();
  const { statusCode, body } = await createTransactionController.execute(req);
  res.status(statusCode).json(body);
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

import 'dotenv/config';
import express from 'express';
import process from 'process';
import {
  CreateUserController,
  GetUserByIdController,
  UpdateUserController,
  DeleteUserController,
} from './src/controllers/index.js';
import { GetUserByIdUseCase } from './src/use-cases/get-user-by-id.js';
import { PostgresGetUserByIdRepository } from './src/repositories/postgres/get-user-by-id.js';
import { PostgresCreateUserRepository } from './src/repositories/postgres/create-user.js';
import { CreateUserUseCase } from './src/use-cases/create-user.js';
import { PostgresDeleteUserRepository } from './src/repositories/postgres/delete-user.js';
import { DeleteUserUseCase } from './src/use-cases/delete-user.js';
import { PostgresUpdateUserRepository } from './src/repositories/postgres/update-user.js';
import { UpdateUserUseCase } from './src/use-cases/update-user.js';
import { PostgresGetUserByEmailRepository } from './src/repositories/postgres/get-user-by-email.js';

const app = express();
app.use(express.json());
const port = process.env.PORT;

app.post('/api/users', async (req, res) => {
  const createUserRepository = new PostgresCreateUserRepository();
  const getUserByEmailRepository = new PostgresGetUserByEmailRepository();
  const createUserUseCase = new CreateUserUseCase(
    getUserByEmailRepository,
    createUserRepository
  );
  const createUserController = new CreateUserController(createUserUseCase);

  const { statusCode, body } = await createUserController.execute(req);

  res.status(statusCode).json(body);
});

app.get('/api/users/:userId', async (req, res) => {
  const getUserByIdRepository = new PostgresGetUserByIdRepository();
  const getUserByIdUseCase = new GetUserByIdUseCase(getUserByIdRepository);
  const getUserByIdController = new GetUserByIdController(getUserByIdUseCase);
  const { statusCode, body } = await getUserByIdController.execute(req);
  res.status(statusCode).json(body);
});

app.patch('/api/users/:userId', async (req, res) => {
  const updateUserRepository = new PostgresUpdateUserRepository();
  const getUserByEmailRepository = new PostgresGetUserByEmailRepository();
  const updateUserUseCase = new UpdateUserUseCase(
    getUserByEmailRepository,
    updateUserRepository
  );
  const updateUserController = new UpdateUserController(updateUserUseCase);
  const { statusCode, body } = await updateUserController.execute(req);
  res.status(statusCode).json(body);
});

app.delete('/api/users/:userId', async (req, res) => {
  const deleteUserRepository = new PostgresDeleteUserRepository();
  const deleteUserUseCase = new DeleteUserUseCase(deleteUserRepository);
  const deleteUserController = new DeleteUserController(deleteUserUseCase);
  const { statusCode, body } = await deleteUserController.execute(req);
  res.status(statusCode).json(body);
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

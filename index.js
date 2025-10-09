import 'dotenv/config';
import express from 'express';
import process from 'process';
import {
  CreateUserController,
  GetUserByIdController,
  UpdateUserController,
} from './src/controllers/index.js';

const app = express();
app.use(express.json());
const port = process.env.PORT;

app.post('/api/users', async (req, res) => {
  const createdUserController = new CreateUserController();

  const { statusCode, body } = await createdUserController.execute(req);

  res.status(statusCode).json(body);
});

app.get('/api/users/:userId', async (req, res) => {
  const getUserByIdController = new GetUserByIdController();
  const { statusCode, body } = await getUserByIdController.execute(req);
  res.status(statusCode).json(body);
});

app.patch('/api/users/:userId', async (req, res) => {
  const updateUserController = new UpdateUserController();
  const { statusCode, body } = await updateUserController.execute(req);
  res.status(statusCode).json(body);
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

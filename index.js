import 'dotenv/config';
import express from 'express';
import process from 'process';
import { CreateUserController } from './src/controllers/create-user.js';

const app = express();
app.use(express.json());
const port = process.env.PORT;

app.post('/api/users', async (req, res) => {
  const createdUserController = new CreateUserController();

  const { statusCode, body } = await createdUserController.execute(req);

  res.status(statusCode).json(body);
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

import 'dotenv/config';
import express from 'express';
import process from 'process';
import { usersRouter, transactionsRouter } from './src/routes/index.js';

const app = express();
app.use(express.json());
const port = process.env.PORT;

app.use('/api/users', usersRouter);
app.use('/api/transactions', transactionsRouter);

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

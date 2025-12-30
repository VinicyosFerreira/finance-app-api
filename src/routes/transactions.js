import { Router } from 'express';
import {
  makeCreateTransactionController,
  makeGetTransactionByUserIdController,
  makeUpdateTransactionController,
  makeDeleteTransactionController,
} from '../factories/controllers/transaction.js';

export const transactionsRouter = Router();

transactionsRouter.get('/', async (req, res) => {
  const getTransactionByUserIdController =
    makeGetTransactionByUserIdController();

  const { statusCode, body } =
    await getTransactionByUserIdController.execute(req);

  res.status(statusCode).json(body);
});

transactionsRouter.post('/', async (req, res) => {
  const createTransactionController = makeCreateTransactionController();
  const { statusCode, body } = await createTransactionController.execute(req);
  res.status(statusCode).json(body);
});

transactionsRouter.patch('/:transactionId', async (req, res) => {
  const updateTransactionController = makeUpdateTransactionController();
  const { statusCode, body } = await updateTransactionController.execute(req);
  res.status(statusCode).json(body);
});

transactionsRouter.delete('/:transactionId', async (req, res) => {
  const deleteTransactionController = makeDeleteTransactionController();
  const { statusCode, body } = await deleteTransactionController.execute(req);
  res.status(statusCode).json(body);
});

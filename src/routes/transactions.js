import { Router } from 'express';
import {
  makeCreateTransactionController,
  makeGetTransactionByUserIdController,
  makeUpdateTransactionController,
  makeDeleteTransactionController,
} from '../factories/controllers/transaction.js';
import { auth } from '../middlewares/auth.js';

export const transactionsRouter = Router();

transactionsRouter.get('/', auth, async (req, res) => {
  const getTransactionByUserIdController =
    makeGetTransactionByUserIdController();

  const { statusCode, body } = await getTransactionByUserIdController.execute({
    ...req,
    query: {
      ...req.query,
      userId: req.userId,
    },
  });

  res.status(statusCode).json(body);
});

transactionsRouter.post('/', auth, async (req, res) => {
  const createTransactionController = makeCreateTransactionController();
  const { statusCode, body } = await createTransactionController.execute({
    ...req,
    body: {
      ...req.body,
      user_id: req.userId,
    },
  });
  res.status(statusCode).json(body);
});

transactionsRouter.patch('/:transactionId', auth, async (req, res) => {
  const updateTransactionController = makeUpdateTransactionController();
  const { statusCode, body } = await updateTransactionController.execute({
    ...req,
    body: {
      ...req.body,
      user_id: req.userId,
    },
  });
  res.status(statusCode).json(body);
});

transactionsRouter.delete('/:transactionId', async (req, res) => {
  const deleteTransactionController = makeDeleteTransactionController();
  const { statusCode, body } = await deleteTransactionController.execute(req);
  res.status(statusCode).json(body);
});

import { Router } from 'express';
import {
  makeCreateUserController,
  makeDeleteUserController,
  makeGetUserBalanceController,
  makeGetUserByIdController,
  makeUpdateUserController,
  makeLoginUserController,
} from '../factories/controllers/user.js';
import { auth } from '../middlewares/auth.js';

export const usersRouter = Router();

usersRouter.post('/', async (req, res) => {
  const createUserController = makeCreateUserController();
  const { statusCode, body } = await createUserController.execute(req);
  res.status(statusCode).json(body);
});

usersRouter.get('/', auth, async (req, res) => {
  const getUserByIdController = makeGetUserByIdController();
  const { statusCode, body } = await getUserByIdController.execute({
    ...req,
    params: {
      userId: req.userId,
    },
  });
  res.status(statusCode).json(body);
});

usersRouter.get('/balance', auth, async (req, res) => {
  const GetUserBalanceController = makeGetUserBalanceController();
  const { statusCode, body } = await GetUserBalanceController.execute({
    ...req,
    params: {
      userId: req.userId,
    },
  });
  res.status(statusCode).json(body);
});

usersRouter.patch('/', auth, async (req, res) => {
  const updateUserController = makeUpdateUserController();
  const { statusCode, body } = await updateUserController.execute({
    ...req,
    params: {
      userId: req.userId,
    },
  });
  res.status(statusCode).json(body);
});

usersRouter.delete('/', auth, async (req, res) => {
  const deleteUserController = makeDeleteUserController();
  const { statusCode, body } = await deleteUserController.execute({
    ...req,
    params: {
      userId: req.userId,
    },
  });
  res.status(statusCode).json(body);
});

usersRouter.post('/login', async (req, res) => {
  const loginUserController = makeLoginUserController();
  const { statusCode, body } = await loginUserController.execute(req);
  res.status(statusCode).json(body);
});

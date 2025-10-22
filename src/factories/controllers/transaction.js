import {
  CreateTransactionController,
  GetTransactionByUserIdController,
} from '../../controllers/index.js';
import {
  PostgresCreateTransactionRepository,
  PostgresGetUserByIdRepository,
  PostgresGetTransactionByUserIdRepository,
} from '../../repositories/postgres/index.js';
import {
  CreateTransactionUseCase,
  GetTransactionUserByIdUseCase,
} from '../../use-cases/index.js';

export const makeCreateTransactionController = () => {
  const createTransactionRepository = new PostgresCreateTransactionRepository();
  const getUserByIdRepository = new PostgresGetUserByIdRepository();
  const createTransactionUseCase = new CreateTransactionUseCase(
    createTransactionRepository,
    getUserByIdRepository
  );
  const createTransactionController = new CreateTransactionController(
    createTransactionUseCase
  );
  return createTransactionController;
};

export const makeGetTransactionByUserIdController = () => {
  const getTransactionByUserIdRepository =
    new PostgresGetTransactionByUserIdRepository();
  const getUserByIdRepository = new PostgresGetUserByIdRepository();

  const getTransactionByUserIdUseCase = new GetTransactionUserByIdUseCase(
    getTransactionByUserIdRepository,
    getUserByIdRepository
  );

  const getTransactionByUserIdController = new GetTransactionByUserIdController(
    getTransactionByUserIdUseCase
  );
  return getTransactionByUserIdController;
};

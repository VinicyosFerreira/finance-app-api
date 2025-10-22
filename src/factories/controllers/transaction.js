import {
  CreateTransactionController,
  DeleteTransactionController,
  GetTransactionByUserIdController,
  UpdateTransactionController,
} from '../../controllers/index.js';
import {
  PostgresCreateTransactionRepository,
  PostgresGetUserByIdRepository,
  PostgresGetTransactionByUserIdRepository,
  PostgresUpdateTransactionRepository,
  PostgresDeleteTransactionRepository,
} from '../../repositories/postgres/index.js';
import {
  CreateTransactionUseCase,
  DeleteTransactionUseCase,
  GetTransactionUserByIdUseCase,
  UpdateTransactionUseCase,
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

export const makeUpdateTransactionController = () => {
  const updateTransactionRepository = new PostgresUpdateTransactionRepository();
  const updateTransactionUseCase = new UpdateTransactionUseCase(
    updateTransactionRepository
  );
  const updateTransactionController = new UpdateTransactionController(
    updateTransactionUseCase
  );

  return updateTransactionController;
};

export const makeDeleteTransactionController = () => {
  const deleteTransactionRepository = new PostgresDeleteTransactionRepository();
  const deleteTransactionUseCase = new DeleteTransactionUseCase(
    deleteTransactionRepository
  );
  const deleteTransactionController = new DeleteTransactionController(
    deleteTransactionUseCase
  );

  return deleteTransactionController;
};

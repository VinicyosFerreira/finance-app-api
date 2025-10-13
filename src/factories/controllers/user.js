import {
  PostgresGetUserByIdRepository,
  PostgresCreateUserRepository,
  PostgresGetUserByEmailRepository,
  PostgresUpdateUserRepository,
  PostgresDeleteUserRepository,
} from '../../repositories/postgres/index.js';
import {
  GetUserByIdUseCase,
  CreateUserUseCase,
  UpdateUserUseCase,
  DeleteUserUseCase,
} from '../../use-cases/index.js';
import {
  GetUserByIdController,
  CreateUserController,
  UpdateUserController,
  DeleteUserController,
} from '../../controllers/index.js';

export const makeGetUserByIdController = () => {
  const getUserByIdRepository = new PostgresGetUserByIdRepository();
  const getUserByIdUseCase = new GetUserByIdUseCase(getUserByIdRepository);
  const getUserByIdController = new GetUserByIdController(getUserByIdUseCase);

  return getUserByIdController;
};

export const makeCreateUserController = () => {
  const createUserRepository = new PostgresCreateUserRepository();
  const getUserByEmailRepository = new PostgresGetUserByEmailRepository();
  const createUserUseCase = new CreateUserUseCase(
    getUserByEmailRepository,
    createUserRepository
  );
  const createUserController = new CreateUserController(createUserUseCase);

  return createUserController;
};

export const makeUpdateUserController = () => {
  const updateUserRepository = new PostgresUpdateUserRepository();
  const getUserByEmailRepository = new PostgresGetUserByEmailRepository();
  const updateUserUseCase = new UpdateUserUseCase(
    getUserByEmailRepository,
    updateUserRepository
  );
  const updateUserController = new UpdateUserController(updateUserUseCase);

  return updateUserController;
};

export const makeDeleteUserController = () => {
  const deleteUserRepository = new PostgresDeleteUserRepository();
  const deleteUserUseCase = new DeleteUserUseCase(deleteUserRepository);
  const deleteUserController = new DeleteUserController(deleteUserUseCase);

  return deleteUserController;
};

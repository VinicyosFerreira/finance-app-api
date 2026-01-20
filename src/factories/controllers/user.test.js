import {
  CreateUserController,
  DeleteUserController,
  GetUserBalanceController,
  GetUserByIdController,
  LoginUserController,
  UpdateUserController,
} from '../../controllers';
import {
  makeCreateUserController,
  makeDeleteUserController,
  makeGetUserBalanceController,
  makeGetUserByIdController,
  makeLoginUserController,
  makeUpdateUserController,
} from './user';
describe('User Controller Factory', () => {
  it('should return a valid CreateUserController', () => {
    const sut = makeCreateUserController();
    expect(sut).toBeInstanceOf(CreateUserController);
  });
  it('should return a valid DeleteUserController', () => {
    const sut = makeDeleteUserController();
    expect(sut).toBeInstanceOf(DeleteUserController);
  });
  it('should return a valid GetUserByIdController', () => {
    const sut = makeGetUserByIdController();
    expect(sut).toBeInstanceOf(GetUserByIdController);
  });
  it('should return a valid GetUserBalanceController', () => {
    const sut = makeGetUserBalanceController();
    expect(sut).toBeInstanceOf(GetUserBalanceController);
  });
  it('should return a valid UpdateUserController', () => {
    const sut = makeUpdateUserController();
    expect(sut).toBeInstanceOf(UpdateUserController);
  });
  it('should return a valid LoginUserController', () => {
    const sut = makeLoginUserController();
    expect(sut).toBeInstanceOf(LoginUserController);
  });
});

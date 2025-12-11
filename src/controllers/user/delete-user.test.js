import { DeleteUserController } from './delete-user.js';
import { faker } from '@faker-js/faker';
import { user } from '../../tests/index.js';

describe('Delete User Controller', () => {
  // stub
  class DeleteUserUseCaseStub {
    execute() {
      return user;
    }
  }

  const makeSut = () => {
    const deleteUserUseCaseStub = new DeleteUserUseCaseStub();
    const sut = new DeleteUserController(deleteUserUseCaseStub);
    return { sut, deleteUserUseCaseStub };
  };

  const httpRequest = {
    params: {
      userId: faker.string.uuid(),
    },
  };

  it('should return 200 if user is deleted', async () => {
    // arrange
    const { sut } = makeSut();

    // act
    const result = await sut.execute(httpRequest);

    // assert
    expect(result.statusCode).toBe(200);
  });

  it('should return 400 if id is not valid', async () => {
    // arrang
    const { sut } = makeSut();

    // act
    const result = await sut.execute({
      params: {
        userId: 'invalid_id',
      },
    });

    // asset
    expect(result.statusCode).toBe(400);
  });

  it('should return 404 if user is not found', async () => {
    // arrange
    const { sut, deleteUserUseCaseStub } = makeSut();
    jest.spyOn(deleteUserUseCaseStub, 'execute').mockReturnValueOnce(null);

    // act
    const result = await sut.execute(httpRequest);

    // assert
    expect(result.statusCode).toBe(404);
  });

  it('should return 500 if DeleteUserUseCase throws', async () => {
    // arrange
    const { sut, deleteUserUseCaseStub } = makeSut();

    jest.spyOn(deleteUserUseCaseStub, 'execute').mockImplementationOnce(() => {
      throw new Error();
    });

    // act
    const result = await sut.execute(httpRequest);

    // assert
    expect(result.statusCode).toBe(500);
  });

  it('should call DeleteUserUseCase with correct params', async () => {
    // arrange
    const { sut, deleteUserUseCaseStub } = makeSut();
    const executeSpy = jest.spyOn(deleteUserUseCaseStub, 'execute');

    // act
    await sut.execute(httpRequest);

    // assert
    expect(executeSpy).toHaveBeenCalledWith(httpRequest.params.userId);
  });
});

import { UserNotFoundError } from '../../errors/user.js';
import { GetTransactionByUserIdController } from './get-transaction-by-user-id.js';
import { faker } from '@faker-js/faker';
import { transaction } from '../../tests/index.js';

describe('Get Transaction By User Id Controller', () => {
  class GetTransactionByUserIdUseCaseStub {
    async execute() {
      return [transaction];
    }
  }

  const makeSut = () => {
    const getTransactionByUserIdUseCaseStub =
      new GetTransactionByUserIdUseCaseStub();
    const sut = new GetTransactionByUserIdController(
      getTransactionByUserIdUseCaseStub
    );
    return { sut, getTransactionByUserIdUseCaseStub };
  };

  it('should return 200 if getting transaction is successful', async () => {
    // arrange
    const { sut } = makeSut();

    // result
    const result = await sut.execute({
      query: {
        userId: faker.string.uuid(),
      },
    });

    // assert
    expect(result.statusCode).toBe(200);
  });

  it('should return 400 if user_id is not provided', async () => {
    // arrange
    const { sut } = makeSut();

    // act
    const result = await sut.execute({
      query: {
        userId: undefined,
      },
    });

    // assert
    expect(result.statusCode).toBe(400);
  });

  it('should return 400 if id is not valid', async () => {
    // arrange
    const { sut } = makeSut();

    // act
    const result = await sut.execute({
      query: {
        userId: 'invalid_id',
      },
    });

    // assert
    expect(result.statusCode).toBe(400);
  });

  it('should return 404 if GetTransactionByUserIdUseCase throws', async () => {
    // arrange
    const { sut, getTransactionByUserIdUseCaseStub } = makeSut();
    import.meta.jest
      .spyOn(getTransactionByUserIdUseCaseStub, 'execute')
      .mockRejectedValueOnce(new UserNotFoundError());

    // act
    const result = await sut.execute({
      query: {
        userId: faker.string.uuid(),
      },
    });

    // assert
    expect(result.statusCode).toBe(404);
  });

  it('should return 500 if GetTransactionByUserIdUseCase throws generic error', async () => {
    // arrange
    const { sut, getTransactionByUserIdUseCaseStub } = makeSut();
    import.meta.jest
      .spyOn(getTransactionByUserIdUseCaseStub, 'execute')
      .mockRejectedValueOnce(new Error());

    // act
    const result = await sut.execute({
      query: {
        userId: faker.string.uuid(),
      },
    });

    // assert
    expect(result.statusCode).toBe(500);
  });

  it('should call GetTransactionByUserIdUseCase with correct params', async () => {
    // arrange
    const { sut, getTransactionByUserIdUseCaseStub } = makeSut();
    const executeSpy = import.meta.jest.spyOn(
      getTransactionByUserIdUseCaseStub,
      'execute'
    );

    const userId = faker.string.uuid();

    // act
    await sut.execute({
      query: {
        userId,
      },
    });

    // assert
    expect(executeSpy).toHaveBeenCalledWith(userId);
  });
});

import { UserNotFoundError } from '../../errors/user.js';
import { GetTransactionByUserIdController } from './get-transaction-by-user-id.js';
import { faker } from '@faker-js/faker';

describe('Get Transaction By User Id Controller', () => {
  class GetTransactionByUserIdUseCaseStub {
    execute() {
      [
        {
          id: faker.string.uuid(),
          user_id: faker.string.uuid(),
          name: faker.commerce.productName(),
          date: faker.date.anytime().toISOString(),
          amount: Number(faker.finance.amount()),
          type: 'EXPENSE',
        },
      ];
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
    jest
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
    jest
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
});

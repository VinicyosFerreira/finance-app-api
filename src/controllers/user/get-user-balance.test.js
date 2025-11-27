import { faker } from '@faker-js/faker';
import { GetUserBalanceController } from './get-user-balance.js';

describe('Get User Balance Controller', () => {
  // stub
  class GetUserBalanceUseCaseStub {
    execute() {
      return faker.number.int();
    }
  }

  const makeSut = () => {
    const getUserBalanceUseCaseStub = new GetUserBalanceUseCaseStub();
    const sut = new GetUserBalanceController(getUserBalanceUseCaseStub);
    return { sut, getUserBalanceUseCaseStub };
  };

  it('should return 200 if getting balance is successful', async () => {
    // arrange
    const { sut } = makeSut();

    // result
    const result = await sut.execute({
      params: {
        userId: faker.string.uuid(),
      },
    });

    // assert
    expect(result.statusCode).toBe(200);
  });

  it('should return 400 if id is not valid', async () => {
    // arrang
    const { sut } = makeSut();

    // result
    const result = await sut.execute({
      params: {
        userId: 'invalid_id',
      },
    });

    // asset
    expect(result.statusCode).toBe(400);
  });

  it('should return 500 if GetUserBalanceUseCase throws', async () => {
    // arrange
    const { sut, getUserBalanceUseCaseStub } = makeSut();

    jest
      .spyOn(getUserBalanceUseCaseStub, 'execute')
      .mockRejectedValueOnce(new Error());

    // act
    const result = await sut.execute({
      params: {
        userId: faker.string.uuid(),
      },
    });

    // assert
    expect(result.statusCode).toBe(500);
  });

  it('should call GetUserBalanceUseCase with correct params', async () => {
    // arrange
    const { sut, getUserBalanceUseCaseStub } = makeSut();
    const executeSpy = jest.spyOn(getUserBalanceUseCaseStub, 'execute');

    const userId = faker.string.uuid();

    // act
    await sut.execute({
      params: {
        userId: userId,
      },
    });

    // assert
    expect(executeSpy).toHaveBeenCalledWith({
      userId: userId,
    });
  });
});

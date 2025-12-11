import { faker } from '@faker-js/faker';
import { GetTransactionUserByIdUseCase } from './get-transaction-by-user-id';
import { UserNotFoundError } from '../../errors/user';
import { user } from '../../tests';

describe('Get Transaction By User ID Use Case', () => {
  // stub
  class GetTransactionByUserIdRepository {
    async execute() {
      return [];
    }
  }

  class GetUserByIdRepository {
    async execute() {
      return user;
    }
  }

  const makeSut = () => {
    const getTransactionByUserIdRepository =
      new GetTransactionByUserIdRepository();
    const getUserByIdRepository = new GetUserByIdRepository();

    const sut = new GetTransactionUserByIdUseCase(
      getTransactionByUserIdRepository,
      getUserByIdRepository
    );

    return {
      sut,
      getTransactionByUserIdRepository,
      getUserByIdRepository,
    };
  };

  it('should return transaction successfully by user ID', async () => {
    // arrange
    const { sut } = makeSut();
    // act
    const result = await sut.execute(faker.string.uuid());

    // assert
    expect(result).toEqual([]);
  });

  it('should throw UserNotFoundError if user does not exist', async () => {
    // arrange
    const { sut, getUserByIdRepository } = makeSut();
    const userId = faker.string.uuid();
    jest.spyOn(getUserByIdRepository, 'execute').mockReturnValueOnce(null);

    // act
    const promise = sut.execute(userId);

    // assert
    await expect(promise).rejects.toThrow(new UserNotFoundError(userId));
  });

  it('should call GetUserByIdRepository with correct user ID', async () => {
    // arrange
    const { sut, getUserByIdRepository } = makeSut();
    const userId = faker.string.uuid();
    const getUserByIdSpy = jest.spyOn(getUserByIdRepository, 'execute');

    // act
    await sut.execute(userId);

    // assert
    expect(getUserByIdSpy).toHaveBeenCalledWith(userId);
  });

  it('should call GetTransactionByUserIdRepository with correct user ID', async () => {
    // arrange
    const { sut, getTransactionByUserIdRepository } = makeSut();
    const userId = faker.string.uuid();
    const getTransactionByUserIdSpy = jest.spyOn(
      getTransactionByUserIdRepository,
      'execute'
    );
    // act
    await sut.execute(userId);
    // assert
    expect(getTransactionByUserIdSpy).toHaveBeenCalledWith(userId);
  });

  it('should throw if GetUserByIdRepository throws', async () => {
    // arrange
    const { sut, getUserByIdRepository } = makeSut();
    const userId = faker.string.uuid();
    jest
      .spyOn(getUserByIdRepository, 'execute')
      .mockRejectedValueOnce(new Error());

    // act
    const promise = sut.execute(userId);

    // assert
    await expect(promise).rejects.toThrow();
  });

  it('should throw if GetTransactionByUserIdRepository throws', async () => {
    // arrange
    const { sut, getTransactionByUserIdRepository } = makeSut();
    const userId = faker.string.uuid();
    jest
      .spyOn(getTransactionByUserIdRepository, 'execute')
      .mockRejectedValueOnce(new Error());

    // act
    const promise = sut.execute(userId);

    // assert
    await expect(promise).rejects.toThrow();
  });
});

import { faker } from '@faker-js/faker';
import { GetUserBalanceUseCase } from './get-balance-user';
import { UserNotFoundError } from '../../errors/user';
import { user } from '../../tests';

describe('Get User Balance Use Case', () => {
  const userBalance = {
    earnings: faker.finance.amount(),
    expenses: faker.finance.amount(),
    investments: faker.finance.amount(),
    balance: faker.finance.amount(),
  };

  // stub
  class GetUserBalanceRepositoryStub {
    async execute() {
      return userBalance;
    }
  }

  class GetUserByIdRepositoryStub {
    async execute() {
      return user;
    }
  }

  const makeSut = () => {
    const getUserBalanceRepository = new GetUserBalanceRepositoryStub();
    const getUserByIdRepository = new GetUserByIdRepositoryStub();

    const sut = new GetUserBalanceUseCase(
      getUserBalanceRepository,
      getUserByIdRepository
    );

    return { sut, getUserBalanceRepository, getUserByIdRepository };
  };

  it('should get user balance successfully', async () => {
    // arrange
    const { sut } = makeSut();

    // act
    const userBalance = await sut.execute(faker.string.uuid());

    // assert
    expect(userBalance).toEqual(userBalance);
  });

  it('should throw UserNotFoundError if user does not exist', async () => {
    // arrange
    const { sut, getUserByIdRepository } = makeSut();
    import.meta.jest
      .spyOn(getUserByIdRepository, 'execute')
      .mockReturnValueOnce(null);
    const userId = faker.string.uuid();

    // act
    const promise = sut.execute(userId);

    // assert
    await expect(promise).rejects.toThrow(new UserNotFoundError(userId));
  });

  it('should call GetUserByIdRepository with correct userId', async () => {
    // arrange
    const { sut, getUserByIdRepository } = makeSut();
    const userId = faker.string.uuid();
    const executeSpy = import.meta.jest.spyOn(getUserByIdRepository, 'execute');

    // act
    await sut.execute(userId);

    // assert
    expect(executeSpy).toHaveBeenCalledWith(userId);
  });

  it('should call GetUserBalanceRepository with correct userId', async () => {
    // arrange
    const { sut, getUserBalanceRepository } = makeSut();
    const userId = faker.string.uuid();
    const executeSpy = import.meta.jest.spyOn(
      getUserBalanceRepository,
      'execute'
    );

    // act
    await sut.execute(userId);

    // assert
    expect(executeSpy).toHaveBeenCalledWith(userId);
  });

  it('should throw if GetUserByIdRepository throws', async () => {
    // arrange
    const { sut, getUserByIdRepository } = makeSut();
    import.meta.jest
      .spyOn(getUserByIdRepository, 'execute')
      .mockRejectedValue(new Error());

    // act
    const promise = sut.execute(user.id);

    // assert
    await expect(promise).rejects.toThrow();
  });

  it('should throw if GetUserBalanceRepository throws', async () => {
    // arrange
    const { sut, getUserBalanceRepository } = makeSut();
    import.meta.jest
      .spyOn(getUserBalanceRepository, 'execute')
      .mockRejectedValue(new Error());

    // act
    const promise = sut.execute(user.id);

    // assert
    await expect(promise).rejects.toThrow();
  });
});

import { CreateTransactionUseCase } from './create-transaction';
import { UserNotFoundError } from '../../errors/user';
import { transaction, user } from '../../tests/index.js';

describe('Create Transaction Use Case', () => {
  // stub
  class CreateTransactionRepository {
    async execute() {
      return {
        id: undefined,
        ...transaction,
      };
    }
  }

  class GetUserByIdRepository {
    async execute() {
      return user;
    }
  }

  class IdGeneratorAdapter {
    execute() {
      return 'id-generated';
    }
  }

  const makeSut = () => {
    const createTransactionRepository = new CreateTransactionRepository();
    const getUserByIdRepository = new GetUserByIdRepository();
    const idGeneratorAdapter = new IdGeneratorAdapter();

    const sut = new CreateTransactionUseCase(
      createTransactionRepository,
      getUserByIdRepository,
      idGeneratorAdapter
    );

    return {
      sut,
      createTransactionRepository,
      getUserByIdRepository,
      idGeneratorAdapter,
    };
  };

  it('should create a transaction successfully', async () => {
    // arrange
    const { sut } = makeSut();

    // act
    const createdTransaction = await sut.execute(transaction);

    // assert
    expect(createdTransaction).toEqual(transaction);
  });

  it('should call GetUserByIdRepository with correct user id', async () => {
    // arrange
    const { sut, getUserByIdRepository } = makeSut();
    const getUserByIdSpy = jest.spyOn(getUserByIdRepository, 'execute');

    // act
    await sut.execute(transaction);

    // assert
    expect(getUserByIdSpy).toHaveBeenCalledWith(transaction.user_id);
  });

  it('should call IdGeneratorAdapter to generate transaction id', async () => {
    // arrange
    const { sut, idGeneratorAdapter } = makeSut();
    const idGeneratorSpy = jest.spyOn(idGeneratorAdapter, 'execute');

    // act
    await sut.execute(transaction);

    // assert
    expect(idGeneratorSpy).toHaveBeenCalled();
  });

  it('should call CreateTransactionRepository with correct values', async () => {
    // arrange
    const { sut, createTransactionRepository } = makeSut();
    const createTransactionSpy = jest.spyOn(
      createTransactionRepository,
      'execute'
    );

    // act
    await sut.execute(transaction);

    // assert
    expect(createTransactionSpy).toHaveBeenCalledWith({
      ...transaction,
      id: 'id-generated',
    });
  });

  it('should throw UserNotFoundError if user does not exist', async () => {
    // arrange
    const { sut, getUserByIdRepository } = makeSut();
    jest.spyOn(getUserByIdRepository, 'execute').mockReturnValueOnce(null);

    // act
    const promise = sut.execute(transaction);

    // assert
    await expect(promise).rejects.toThrow(
      new UserNotFoundError(transaction.user_id)
    );
  });

  it('should throw if GetUserByIdRepository throws', async () => {
    // arrange
    const { sut, getUserByIdRepository } = makeSut();
    jest.spyOn(getUserByIdRepository, 'execute').mockRejectedValue(new Error());

    // act
    const promise = sut.execute(transaction);

    // assert
    await expect(promise).rejects.toThrow();
  });

  it('should throw if IdGeneratorAdapter throws', async () => {
    // arrange
    const { sut, idGeneratorAdapter } = makeSut();
    jest.spyOn(idGeneratorAdapter, 'execute').mockImplementationOnce(() => {
      throw new Error();
    });

    // act
    const promise = sut.execute(transaction);

    // assert
    await expect(promise).rejects.toThrow();
  });

  it('should throw if CreateTransactionRepository throws', async () => {
    // arrange
    const { sut, createTransactionRepository } = makeSut();
    jest
      .spyOn(createTransactionRepository, 'execute')
      .mockRejectedValue(new Error());

    // act
    const promise = sut.execute(transaction);

    // assert
    await expect(promise).rejects.toThrow();
  });
});

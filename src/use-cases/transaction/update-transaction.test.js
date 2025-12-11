import { faker } from '@faker-js/faker';
import { UpdateTransactionUseCase } from './update-transaction';

describe('Update Transaction Use Case', () => {
  const transaction = {
    id: faker.string.uuid(),
    user_id: faker.string.uuid(),
    name: faker.commerce.productName(),
    date: faker.date.anytime().toISOString(),
    amount: Number(faker.finance.amount()),
    type: 'EXPENSE',
  };

  // stub
  class UpdateTransactionRepositoryStub {
    async execute(transactionId) {
      return {
        id: transactionId,
        ...transaction,
      };
    }
  }

  const makeSut = () => {
    const updateTransactionRepositoryStub =
      new UpdateTransactionRepositoryStub();
    const sut = new UpdateTransactionUseCase(updateTransactionRepositoryStub);
    return {
      sut,
      updateTransactionRepositoryStub,
    };
  };

  it('should return updated transaction on success', async () => {
    // arrange
    const { sut } = makeSut();
    const transactionId = faker.string.uuid();

    // act
    const result = await sut.execute(transactionId, {
      amount: transaction.amount,
      type: transaction.type,
    });

    // assert
    expect(result).toEqual(transaction);
  });

  it('should call UpdateTransactionRepository with correct values', async () => {
    // arrange
    const { sut, updateTransactionRepositoryStub } = makeSut();
    const updateSpy = jest.spyOn(updateTransactionRepositoryStub, 'execute');
    const transactionId = faker.string.uuid();

    // act
    await sut.execute(transactionId, {
      amount: transaction.amount,
      type: transaction.type,
    });

    // assert
    expect(updateSpy).toHaveBeenCalledWith(transactionId, {
      amount: transaction.amount,
      type: transaction.type,
    });
  });

  it('should throw if UpdateTransactionRepository throws', async () => {
    // arrange
    const { sut, updateTransactionRepositoryStub } = makeSut();
    jest
      .spyOn(updateTransactionRepositoryStub, 'execute')
      .mockRejectedValueOnce(new Error());

    // act
    const promise = sut.execute(faker.string.uuid(), transaction);

    // assert
    await expect(promise).rejects.toThrow();
  });
});

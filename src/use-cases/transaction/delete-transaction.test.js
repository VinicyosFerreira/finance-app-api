import { faker } from '@faker-js/faker';
import { DeleteTransactionUseCase } from './delete-transaction';

describe('Delete Transaction Use Case', () => {
  const transaction = {
    id: faker.string.uuid(),
    user_id: faker.string.uuid(),
    name: faker.commerce.productName(),
    date: faker.date.anytime().toISOString(),
    amount: Number(faker.finance.amount()),
    type: 'EXPENSE',
  };

  // stub
  class DeleteTransactionRepositoryStub {
    async execute(transactionId) {
      return {
        ...transaction,
        id: transactionId,
      };
    }
  }

  const makeSut = () => {
    const deleteTransactionRepository = new DeleteTransactionRepositoryStub();
    const sut = new DeleteTransactionUseCase(deleteTransactionRepository);
    return { sut, deleteTransactionRepository };
  };

  it('should delete a transaction successfully', async () => {
    // arrange
    const { sut } = makeSut();

    // act
    const deletedTransaction = await sut.execute(transaction.id);

    // assert
    expect(deletedTransaction).toEqual({
      ...transaction,
      id: transaction.id,
    });
  });

  it('should call DeleteTransactionRepository with correct values', async () => {
    // arrange
    const { sut, deleteTransactionRepository } = makeSut();
    const executeSpy = jest.spyOn(deleteTransactionRepository, 'execute');

    // act
    await sut.execute(transaction.id);

    // assert
    expect(executeSpy).toHaveBeenCalledWith(transaction.id);
  });

  it('should throw if DeleteTransactionRepositoy throws', async () => {
    // arrange
    const { sut, deleteTransactionRepository } = makeSut();
    jest
      .spyOn(deleteTransactionRepository, 'execute')
      .mockRejectedValueOnce(new Error());

    // act
    const promise = sut.execute(transaction.id);

    // assert
    await expect(promise).rejects.toThrow();
  });
});

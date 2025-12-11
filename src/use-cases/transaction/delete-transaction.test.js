import { DeleteTransactionUseCase } from './delete-transaction';
import { transaction } from '../../tests/index.js';

describe('Delete Transaction Use Case', () => {
  // stub
  class DeleteTransactionRepositoryStub {
    async execute() {
      return transaction;
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
    expect(deletedTransaction).toEqual(transaction);
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

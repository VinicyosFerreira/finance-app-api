import { faker } from '@faker-js/faker';
import { DeleteTransactionController } from './delete-transaction.js';
import { transaction } from '../../tests/index.js';
import { TransactionNotFoundError } from '../../errors/transaction.js';

describe('Delete Transaction Controller', () => {
  class DeleteTransactionUseCaseStub {
    async execute() {
      return transaction;
    }
  }

  const makeSut = () => {
    const deleteTransactionUseCase = new DeleteTransactionUseCaseStub();
    const sut = new DeleteTransactionController(deleteTransactionUseCase);

    return { sut, deleteTransactionUseCase };
  };

  it('should return 200 if deleting transaction is successful', async () => {
    // arrange
    const { sut } = makeSut();

    // act
    const result = await sut.execute({
      params: {
        transactionId: faker.string.uuid(),
      },
    });

    // assert
    expect(result.statusCode).toBe(200);
  });

  it('should return 400 if id not valid', async () => {
    // arrange
    const { sut } = makeSut();

    // act
    const result = await sut.execute({
      params: {
        transactionId: 'invalid_id',
      },
    });

    // assert
    expect(result.statusCode).toBe(400);
  });

  it('should return 404 if transaction not found', async () => {
    // arrange
    const { sut, deleteTransactionUseCase } = makeSut();
    jest
      .spyOn(deleteTransactionUseCase, 'execute')
      .mockRejectedValueOnce(new TransactionNotFoundError());

    // act
    const result = await sut.execute({
      params: {
        transactionId: faker.string.uuid(),
      },
    });

    // assert
    expect(result.statusCode).toBe(404);
  });

  it('should return 500 if DeleteTransactionUseCase throws', async () => {
    // arrange
    const { sut, deleteTransactionUseCase } = makeSut();
    jest
      .spyOn(deleteTransactionUseCase, 'execute')
      .mockRejectedValueOnce(new Error());

    // act
    const result = await sut.execute({
      params: {
        transactionId: faker.string.uuid(),
      },
    });

    // assert
    expect(result.statusCode).toBe(500);
  });

  it('should call DeleteTransactionUseCase with correct params', async () => {
    // act
    const { sut, deleteTransactionUseCase } = makeSut();
    const executeSpy = jest.spyOn(deleteTransactionUseCase, 'execute');

    const transactionId = faker.string.uuid();

    // arrange
    await sut.execute({
      params: {
        transactionId: transactionId,
      },
    });

    // assert
    expect(executeSpy).toHaveBeenCalledWith(transactionId);
  });
});

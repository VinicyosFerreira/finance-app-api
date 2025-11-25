import { faker } from '@faker-js/faker';
import { DeleteTransactionController } from './delete-transaction.js';
describe('Delete Transaction Controller', () => {
  class DeleteTransactionUseCaseStub {
    async execute() {
      return {
        id: faker.string.uuid(),
        user_id: faker.string.uuid(),
        name: faker.commerce.productName(),
        date: faker.date.anytime().toISOString(),
        amount: Number(faker.finance.amount()),
        type: 'EXPENSE',
      };
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
    jest.spyOn(deleteTransactionUseCase, 'execute').mockReturnValueOnce(null);

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
});

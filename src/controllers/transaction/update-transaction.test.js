import { faker } from '@faker-js/faker';
import { UpdateTransactionController } from './update-transaction';
import { transaction } from '../../tests';
import { TransactionNotFoundError } from '../../errors';

describe('Update Transaction Controller', () => {
  class UpdateTransactionUseCaseStub {
    async execute() {
      return transaction;
    }
  }

  const makeSut = () => {
    const updateTransactionUseCaseStub = new UpdateTransactionUseCaseStub();
    const sut = new UpdateTransactionController(updateTransactionUseCaseStub);
    return { sut, updateTransactionUseCaseStub };
  };

  const httpRequest = {
    params: {
      transactionId: faker.string.uuid(),
    },
    body: {
      name: faker.commerce.productName(),
      date: faker.date.anytime().toISOString(),
      amount: Number(faker.finance.amount()),
      type: 'EXPENSE',
    },
  };

  it('should return 200 if updating transaction is successful', async () => {
    // arrange
    const { sut } = makeSut();

    // result
    const result = await sut.execute(httpRequest);

    // assert
    expect(result.statusCode).toBe(200);
  });

  it('should return 400 if id is not valid', async () => {
    // arrange
    const { sut } = makeSut();

    const result = await sut.execute({
      ...httpRequest,
      params: {
        transactionId: 'invalid_id',
      },
    });

    // assert
    expect(result.statusCode).toBe(400);
  });

  it('should return 400 if unallowed field is provided', async () => {
    // arrange
    const { sut } = makeSut();

    // act
    const result = await sut.execute({
      ...httpRequest,
      body: {
        ...httpRequest.body,
        unallowed_field: 'unallowed_value',
      },
    });

    // assert
    expect(result.statusCode).toBe(400);
  });

  it('should return 400 if amount is not valid', async () => {
    // arrange
    const { sut } = makeSut();

    // act
    const result = await sut.execute({
      ...httpRequest,
      body: {
        ...httpRequest.body,
        amount: 'invalid_amount',
      },
    });

    // assert
    expect(result.statusCode).toBe(400);
  });

  it('should return 400 if type is not [EARNING, EXPENSE, INVESTMENT]', async () => {
    // arrange
    const { sut } = makeSut();

    // act
    const result = await sut.execute({
      ...httpRequest,
      body: {
        ...httpRequest.body,
        type: 'invalid_type',
      },
    });

    // assert
    expect(result.statusCode).toBe(400);
  });

  it('should return 404 if UpdateTransactionUseCase throws TransactionNotFoundError', async () => {
    // arrange
    const { sut, updateTransactionUseCaseStub } = makeSut();
    jest
      .spyOn(updateTransactionUseCaseStub, 'execute')
      .mockRejectedValueOnce(new TransactionNotFoundError(transaction.id));

    // act
    const result = await sut.execute(httpRequest);

    // assert
    expect(result.statusCode).toBe(404);
  });

  it('should return 500 if UpdateTransactionUseCase throws', async () => {
    // arrange
    const { sut, updateTransactionUseCaseStub } = makeSut();
    jest
      .spyOn(updateTransactionUseCaseStub, 'execute')
      .mockRejectedValueOnce(new Error());

    // act
    const result = await sut.execute(httpRequest);

    // assert
    expect(result.statusCode).toBe(500);
  });

  it('should call UpdateTransactionUseCase with correct params', async () => {
    // arrange
    const { sut, updateTransactionUseCaseStub } = makeSut();
    jest.spyOn(updateTransactionUseCaseStub, 'execute');

    // act
    await sut.execute(httpRequest);

    // assert
    expect(updateTransactionUseCaseStub.execute).toHaveBeenCalledWith(
      httpRequest.params.transactionId,
      httpRequest.body
    );
  });
});

import { faker } from '@faker-js/faker';
import { CreateTransactionController } from './create-transaction.js';
describe('Create Transaction Controller', () => {
  class CreateTransactionUseCaseStub {
    async execute(transaction) {
      return transaction;
    }
  }

  const makeSut = () => {
    const createTransactionUseCaseStub = new CreateTransactionUseCaseStub();
    const sut = new CreateTransactionController(createTransactionUseCaseStub);
    return { sut, createTransactionUseCaseStub };
  };
  //  id: createTransactionParams.id,
  //     user_id: createTransactionParams.user_id,
  //     name: createTransactionParams.name,
  //     date: createTransactionParams.date,
  //     amount: createTransactionParams.amount,
  //     type: createTransactionParams.type,

  const httpRequest = {
    body: {
      user_id: faker.string.uuid(),
      name: faker.commerce.productName(),
      date: faker.date.anytime().toISOString(),
      amount: Number(faker.finance.amount()),
      type: 'EXPENSE',
    },
  };

  it('should return 201 if creating transaction is successful', async () => {
    // arrange
    const { sut } = makeSut();

    // act
    const result = await sut.execute(httpRequest);

    // assert
    expect(result.statusCode).toBe(201);
  });

  it('should return 201 if createing transaction is successful(EARNING)', async () => {
    // arrange
    const { sut } = makeSut();

    // act
    const result = await sut.execute({
      body: {
        ...httpRequest.body,
      },
      type: 'EARNING',
    });

    // assert
    expect(result.statusCode).toBe(201);
  });

  it('should return 201 if createing transaction is successful(INVESTMENT)', async () => {
    // arrange
    const { sut } = makeSut();

    // act
    const result = await sut.execute({
      body: {
        ...httpRequest.body,
      },
      type: 'EARNING',
    });

    // assert
    expect(result.statusCode).toBe(201);
  });

  it('should return 400 if user_id is not provided', async () => {
    // arrange
    const { sut } = makeSut();

    // result
    const result = await sut.execute({
      body: {
        ...httpRequest.body,
        user_id: undefined,
      },
    });

    // assert
    expect(result.statusCode).toBe(400);
  });

  it('should return 400 if name is not provided', async () => {
    // arrange
    const { sut } = makeSut();

    // result
    const result = await sut.execute({
      body: {
        ...httpRequest.body,
        name: undefined,
      },
    });

    // assert
    expect(result.statusCode).toBe(400);
  });

  it('should return 400 if date is not provided', async () => {
    // arrange
    const { sut } = makeSut();

    // result
    const result = await sut.execute({
      body: {
        ...httpRequest.body,
        date: undefined,
      },
    });

    // assert
    expect(result.statusCode).toBe(400);
  });

  it('should return 400 if amount is not provided', async () => {
    // arrange
    const { sut } = makeSut();

    // result
    const result = await sut.execute({
      body: {
        ...httpRequest.body,
        amount: undefined,
      },
    });

    // assert
    expect(result.statusCode).toBe(400);
  });

  it('should return 400 if type is not provided', async () => {
    // arrange
    const { sut } = makeSut();

    // result
    const result = await sut.execute({
      body: {
        ...httpRequest.body,
        type: undefined,
      },
    });

    // assert
    expect(result.statusCode).toBe(400);
  });

  it('should return 400 if date is not valid', async () => {
    // arrange
    const { sut } = makeSut();

    // result
    const result = await sut.execute({
      body: {
        ...httpRequest.body,
        date: 'invalid_date',
      },
    });

    // assert
    expect(result.statusCode).toBe(400);
  });

  it('should return 400 if amount is not valid', async () => {
    // arrange
    const { sut } = makeSut();

    // result
    const result = await sut.execute({
      body: {
        ...httpRequest.body,
        date: 'invalid_amount',
      },
    });

    // assert
    expect(result.statusCode).toBe(400);
  });

  it('should return 400 if type is not [EARNING, EXPENSE, INVESTMENT]', async () => {
    // arrange
    const { sut } = makeSut();

    // result
    const result = await sut.execute({
      body: {
        ...httpRequest.body,
        type: 'invalid_type',
      },
    });

    // assert
    expect(result.statusCode).toBe(400);
  });

  it('should return 500 if CreateTransactionUseCase throws', async () => {
    // arrange
    const { sut, createTransactionUseCaseStub } = makeSut();
    jest
      .spyOn(createTransactionUseCaseStub, 'execute')
      .mockRejectedValueOnce(new Error());

    // result
    const result = await sut.execute(httpRequest);

    // assert
    expect(result.statusCode).toBe(500);
  });
});

import { faker } from '@faker-js/faker';
import { UpdateUserController } from './update-user.js';
import { EmailAlreadyInUseError } from '../../errors/user';
import { user } from '../../tests/index.js';

describe('Update User Controller', () => {
  class UpdateUserUseCaseStub {
    async execute() {
      return user;
    }
  }

  const makeSut = () => {
    const updateUserUseCaseStub = new UpdateUserUseCaseStub();
    const sut = new UpdateUserController(updateUserUseCaseStub);

    return { sut, updateUserUseCaseStub };
  };

  const httpRequest = {
    params: {
      userId: faker.string.uuid(),
    },
    body: {
      first_name: faker.person.firstName(),
      last_name: faker.person.lastName(),
      email: faker.internet.email(),
      password: faker.internet.password({
        length: 7,
      }),
    },
  };

  it('should return 200 if user is updated', async () => {
    // act
    const { sut } = makeSut();

    // arrange
    const result = await sut.execute(httpRequest);

    // assert
    expect(result.statusCode).toBe(200);
  });

  it('should return 400 if id is not valid', async () => {
    // act
    const { sut } = makeSut();

    // arrange
    const result = await sut.execute({
      params: {
        userId: 'invalid_id',
      },
      body: httpRequest.body,
    });

    // assert
    expect(result.statusCode).toBe(400);
  });

  it('should return 400 if email provided is not valid', async () => {
    // act
    const { sut } = makeSut();

    // arrange
    const result = await sut.execute({
      params: httpRequest.params,
      body: {
        ...httpRequest.body,
        email: 'invalid_email',
      },
    });

    // assert
    expect(result.statusCode).toBe(400);
  });

  it('should return 400 if password provided is not valid', async () => {
    // act
    const { sut } = makeSut();

    // arrange
    const result = await sut.execute({
      params: httpRequest.params,
      body: {
        ...httpRequest.body,
        password: faker.internet.password({
          length: 5,
        }),
      },
    });

    // assert
    expect(result.statusCode).toBe(400);
  });

  it('should return 400 if unallowed field is provided', async () => {
    // act
    const { sut } = makeSut();

    // arrange
    const result = await sut.execute({
      params: httpRequest.params,
      body: {
        ...httpRequest.body,
        unallowed_field: 'unallowed_value',
      },
    });

    // assert
    expect(result.statusCode).toBe(400);
  });

  it('should return 500 if throws generic error on the server', async () => {
    // act
    const { sut, updateUserUseCaseStub } = makeSut();
    jest.spyOn(updateUserUseCaseStub, 'execute').mockRejectedValue(new Error());

    // arrange
    const result = await sut.execute(httpRequest);

    // assert
    expect(result.statusCode).toBe(500);
  });

  it('should return 400 if throw EmailAlreadyInUseError', async () => {
    // act
    const { sut, updateUserUseCaseStub } = makeSut();
    jest
      .spyOn(updateUserUseCaseStub, 'execute')
      .mockRejectedValueOnce(
        new EmailAlreadyInUseError(faker.internet.email())
      );

    // arrange
    const result = await sut.execute(httpRequest);

    // assert
    expect(result.statusCode).toBe(400);
  });

  it('should call UpdateUserUseCase with correct params', async () => {
    // arrange
    const { sut, updateUserUseCaseStub } = makeSut();
    const executeSpy = jest.spyOn(updateUserUseCaseStub, 'execute');

    // act
    await sut.execute(httpRequest);

    // assert
    expect(executeSpy).toHaveBeenCalledWith(
      httpRequest.params.userId,
      httpRequest.body
    );
  });
});

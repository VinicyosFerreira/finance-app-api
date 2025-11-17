import { CreateUserController } from './create-user.js';
import { faker } from '@faker-js/faker';
import { EmailAlreadyInUseError } from '../../errors/user.js';

describe('Create User Controller', () => {
  // stub
  class CreateUserUseCaseStub {
    execute(user) {
      return user;
    }
  }

  it('should return 201 when creating a user successfully', async () => {
    // arrange
    const createUserUseCaseStub = new CreateUserUseCaseStub();
    const createUserController = new CreateUserController(
      createUserUseCaseStub
    );
    const httpRequest = {
      body: {
        first_name: faker.person.firstName(),
        last_name: faker.person.lastName(),
        email: faker.internet.email(),
        password: faker.internet.password({
          length: 7,
        }),
      },
    };

    // act
    const result = await createUserController.execute(httpRequest);

    // assert
    expect(result.statusCode).toBe(201);
    expect(result.body).not.toBeUndefined();
    expect(result.body).toEqual(httpRequest.body);
  });

  it('should return 400 if first_name is not provided', async () => {
    // arrange
    const createUserUseCaseStub = new CreateUserUseCaseStub();
    const createUserController = new CreateUserController(
      createUserUseCaseStub
    );
    const httpRequest = {
      body: {
        last_name: faker.person.lastName(),
        email: faker.internet.email(),
        password: faker.internet.password({
          length: 7,
        }),
      },
    };
    // act
    const result = await createUserController.execute(httpRequest);

    // assert
    expect(result.statusCode).toBe(400);
  });

  it('should return 400 if last_name is not provided', async () => {
    // arrange
    const createUserUseCaseStub = new CreateUserUseCaseStub();
    const createUserController = new CreateUserController(
      createUserUseCaseStub
    );
    const httpRequest = {
      body: {
        first_name: faker.person.firstName(),
        last_name: faker.person.lastName(),
        password: faker.internet.password({
          length: 7,
        }),
      },
    };

    // act
    const result = await createUserController.execute(httpRequest);

    // assert
    expect(result.statusCode).toBe(400);
  });

  it('should return 400 if email is not provided', async () => {
    // arrange
    const createUserUseCaseStub = new CreateUserUseCaseStub();
    const createUserController = new CreateUserController(
      createUserUseCaseStub
    );
    const httpRequest = {
      body: {
        first_name: faker.person.firstName(),
        last_name: faker.person.lastName(),
        password: faker.internet.password({
          length: 7,
        }),
      },
    };

    // act
    const result = await createUserController.execute(httpRequest);

    // assert
    expect(result.statusCode).toBe(400);
  });

  it('should return 400 if email is not valid', async () => {
    // arrange
    const createUserUseCaseStub = new CreateUserUseCaseStub();
    const createUserController = new CreateUserController(
      createUserUseCaseStub
    );
    const httpRequest = {
      body: {
        first_name: faker.person.firstName(),
        last_name: faker.person.lastName(),
        email: 'invalid_email',
        password: faker.internet.password({
          length: 7,
        }),
      },
    };

    // act
    const result = await createUserController.execute(httpRequest);

    // assert
    expect(result.statusCode).toBe(400);
  });

  it('should return 400 if password is not provided', async () => {
    // arrange
    const createUserUseCaseStub = new CreateUserUseCaseStub();
    const createUserController = new CreateUserController(
      createUserUseCaseStub
    );
    const httpRequest = {
      body: {
        first_name: faker.person.firstName(),
        last_name: faker.person.lastName(),
        email: faker.internet.email(),
      },
    };

    // act
    const result = await createUserController.execute(httpRequest);

    // assert
    expect(result.statusCode).toBe(400);
  });

  it('should return 400 if password is less than 6 characters', async () => {
    // arrange
    const createUserUseCaseStub = new CreateUserUseCaseStub();
    const createUserController = new CreateUserController(
      createUserUseCaseStub
    );
    const httpRequest = {
      body: {
        first_name: faker.person.firstName(),
        last_name: faker.person.lastName(),
        email: faker.internet.email(),
        password: faker.internet.password({
          length: 5,
        }),
      },
    };

    // act
    const result = await createUserController.execute(httpRequest);

    // assert
    expect(result.statusCode).toBe(400);
  });

  it('should call CreateUserUseCase with correct params', async () => {
    // arrange
    const createUserUseCaseStub = new CreateUserUseCaseStub();
    const createUserController = new CreateUserController(
      createUserUseCaseStub
    );
    const httpRequest = {
      body: {
        first_name: faker.person.firstName(),
        last_name: faker.person.lastName(),
        email: faker.internet.email(),
        password: faker.internet.password({
          length: 7,
        }),
      },
    };

    const executeSpy = jest.spyOn(createUserUseCaseStub, 'execute');

    // act
    await createUserController.execute(httpRequest);

    // assert
    expect(executeSpy).toHaveBeenCalledWith(httpRequest.body);
    expect(executeSpy).toHaveBeenCalledTimes(1);
  });

  it('should return 500 if CreateUserUseCase throws', async () => {
    // arrange
    const createUserUseCaseStub = new CreateUserUseCaseStub();
    const createUserController = new CreateUserController(
      createUserUseCaseStub
    );
    const httpRequest = {
      body: {
        first_name: faker.person.firstName(),
        last_name: faker.person.lastName(),
        email: faker.internet.email(),
        password: faker.internet.password({
          length: 7,
        }),
      },
    };

    jest.spyOn(createUserUseCaseStub, 'execute').mockImplementationOnce(() => {
      throw new Error();
    });

    // act
    const result = await createUserController.execute(httpRequest);

    // assert
    expect(result.statusCode).toBe(500);
  });

  it('should return 400 if CreateUserUseCaser throw EmailAlreadyInUseError', async () => {
    // arrange
    const createUserUseCaseStub = new CreateUserUseCaseStub();
    const createUserController = new CreateUserController(
      createUserUseCaseStub
    );
    const httpRequest = {
      body: {
        first_name: faker.person.firstName(),
        last_name: faker.person.lastName(),
        email: faker.internet.email(),
        password: faker.internet.password({
          length: 7,
        }),
      },
    };

    jest.spyOn(createUserUseCaseStub, 'execute').mockImplementationOnce(() => {
      throw new EmailAlreadyInUseError(httpRequest.body.email);
    });

    // act
    const result = await createUserController.execute(httpRequest);

    // assert
    expect(result.statusCode).toBe(400);
  });
});

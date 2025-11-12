import { CreateUserController } from './create-user.js';

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
        first_name: 'Vinicyos',
        last_name: 'Ferreira',
        email: 'vinif@11.com',
        password: '12345678',
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
        last_name: 'Ferreira',
        email: 'vinif@11.com',
        password: '12345678',
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
        first_name: 'Vinicyos',
        last_name: 'Ferreira',
        password: '12345678',
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
        first_name: 'vinicyos',
        last_name: 'ferreira',
        password: '12345678',
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
        first_name: 'vinicyos',
        last_name: 'ferreira',
        email: 'vi',
        password: '12345678',
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
        first_name: 'Vinicyos',
        last_name: 'Ferreira',
        email: 'vinif@11.com',
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
        first_name: 'Vinicyos',
        last_name: 'Ferreira',
        email: 'vinif@11.com',
        password: '1234',
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
        first_name: 'Vinicyos',
        last_name: 'Ferreira',
        email: 'vinif@11.com',
        password: '12345678',
      },
    };

    const executeSpy = jest.spyOn(createUserUseCaseStub, 'execute');

    // act
    await createUserController.execute(httpRequest);

    // assert
    expect(executeSpy).toHaveBeenCalledWith(httpRequest.body);
    expect(executeSpy).toHaveBeenCalledTimes(1);
  });
});

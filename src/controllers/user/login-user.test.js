import { faker } from '@faker-js/faker';
import { user } from '../../tests/index.js';
import { LoginUserController } from './login-user';
import { InvalidPasswordError, UserNotFoundError } from '../../errors';

describe('Login User Controller', () => {
  // stub
  class LoginUserUseCaseStub {
    async execute() {
      return {
        ...user,
        tokens: {
          access_token: 'any_token',
          refresh_token: 'any_token',
        },
      };
    }
  }

  const httpRequest = {
    body: {
      email: faker.internet.email(),
      password: faker.internet.password({
        length: 7,
      }),
    },
  };

  const makeSut = () => {
    const loginUserUseCase = new LoginUserUseCaseStub();
    const sut = new LoginUserController(loginUserUseCase);
    return { sut, loginUserUseCase };
  };

  it('should return 200 if user is logged in sucessfully', async () => {
    const { sut } = makeSut();

    const result = await sut.execute(httpRequest);

    expect(result.statusCode).toBe(200);
    expect(result.body.tokens.access_token).not.toBeUndefined();
    expect(result.body.tokens.refresh_token).not.toBeUndefined();
  });

  it('should return 400 if email is not provided', async () => {
    const { sut } = makeSut();

    const result = await sut.execute({
      body: {
        ...httpRequest.body,
        email: undefined,
      },
    });

    expect(result.statusCode).toBe(400);
  });

  it('should return 400 if password is not provided', async () => {
    const { sut } = makeSut();

    const result = await sut.execute({
      body: {
        ...httpRequest.body,
        password: undefined,
      },
    });

    expect(result.statusCode).toBe(400);
  });

  it('should return 404 if UserNotFoundError is thrown', async () => {
    const { sut, loginUserUseCase } = makeSut();
    import.meta.jest
      .spyOn(loginUserUseCase, 'execute')
      .mockRejectedValueOnce(new UserNotFoundError(user.email));

    const result = await sut.execute(httpRequest);

    expect(result.statusCode).toBe(404);
  });

  it('should return 401 if unauthorized credentials are provided', async () => {
    const { sut, loginUserUseCase } = makeSut();
    import.meta.jest
      .spyOn(loginUserUseCase, 'execute')
      .mockRejectedValueOnce(new InvalidPasswordError());

    const result = await sut.execute(httpRequest);

    expect(result.statusCode).toBe(401);
  });

  it('should return 500 if throws generic error on the server', async () => {
    const { sut, loginUserUseCase } = makeSut();
    import.meta.jest
      .spyOn(loginUserUseCase, 'execute')
      .mockRejectedValueOnce(new Error());

    const result = await sut.execute(httpRequest);

    expect(result.statusCode).toBe(500);
  });
});

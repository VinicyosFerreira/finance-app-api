import { InvalidPasswordError, UserNotFoundError } from '../../errors';
import { user } from '../../tests/index.js';
import { LoginUserUseCase } from './login-user';

describe('Login User Use Case', () => {
  // stub
  class GetUserByEmailRepositoryStub {
    async execute() {
      return user;
    }
  }

  class PasswordComparatorAdapter {
    async execute() {
      return true;
    }
  }

  class TokenGeneratorAdapter {
    execute() {
      return {
        access_token: 'any_token',
        refresh_token: 'any_token',
      };
    }
  }

  const makeSut = () => {
    const getUserByEmailRepository = new GetUserByEmailRepositoryStub();
    const passwordComparatorAdapter = new PasswordComparatorAdapter();
    const tokenGeneratorAdapter = new TokenGeneratorAdapter();
    const sut = new LoginUserUseCase(
      getUserByEmailRepository,
      passwordComparatorAdapter,
      tokenGeneratorAdapter
    );

    return {
      sut,
      getUserByEmailRepository,
      passwordComparatorAdapter,
      tokenGeneratorAdapter,
    };
  };

  it('should return user with token successfully', async () => {
    const { sut } = makeSut();
    const result = await sut.execute(user.email, user.password);
    expect(result).toEqual({
      ...user,
      tokens: {
        access_token: 'any_token',
        refresh_token: 'any_token',
      },
    });
  });

  it('should throw new UserNotFoundError if user does not exist', async () => {
    // arrange
    const { sut, getUserByEmailRepository } = makeSut();
    import.meta.jest
      .spyOn(getUserByEmailRepository, 'execute')
      .mockReturnValueOnce(null);

    // act
    const result = sut.execute(user.email, user.password);

    // assert
    await expect(result).rejects.toThrow(new UserNotFoundError());
  });

  it('should PasswordComparatorAdapter return false if password does not match', async () => {
    // arrange
    const { sut, passwordComparatorAdapter } = makeSut();
    import.meta.jest
      .spyOn(passwordComparatorAdapter, 'execute')
      .mockReturnValueOnce(false);

    // act
    const result = sut.execute(user.email, user.password);

    // assert
    await expect(result).rejects.toThrow(new InvalidPasswordError());
  });

  it('should call GetUserByEmailRepository with correct email', async () => {
    // arrange
    const { sut, getUserByEmailRepository } = makeSut();
    const getUserByEmailSpy = import.meta.jest.spyOn(
      getUserByEmailRepository,
      'execute'
    );

    // act
    await sut.execute(user.email, user.password);

    // assert
    expect(getUserByEmailSpy).toHaveBeenCalledWith(user.email);
  });
});

import { CreateUserUseCase } from './create-user';
import { EmailAlreadyInUseError } from '../../errors/user';
import { user } from '../../tests';

describe('Create User Use Case', () => {
  // stubs
  class GetUserByEmailRepositoryStub {
    async execute() {
      return null;
    }
  }

  class CreateUserRepositoryStub {
    async execute() {
      return {
        id: undefined,
        ...user,
      };
    }
  }

  class PasswordHasherAdapterStub {
    async execute() {
      return `hashed-password`;
    }
  }

  class IdGeneratorAdapterStub {
    execute() {
      return `generated-id`;
    }
  }

  class TokenGeneratorAdapterStub {
    execute() {
      return {
        accessToken: 'any_access_token',
        refreshToken: 'any_refresh_token',
      };
    }
  }

  const makeSut = () => {
    const getUserByEmailRepositoryStub = new GetUserByEmailRepositoryStub();
    const createUserRepositoryStub = new CreateUserRepositoryStub();
    const passwordHasherAdapterStub = new PasswordHasherAdapterStub();
    const idGeneratorAdapterStub = new IdGeneratorAdapterStub();
    const tokenGeneratorAdapter = new TokenGeneratorAdapterStub();

    const sut = new CreateUserUseCase(
      getUserByEmailRepositoryStub,
      createUserRepositoryStub,
      passwordHasherAdapterStub,
      idGeneratorAdapterStub,
      tokenGeneratorAdapter
    );

    return {
      sut,
      getUserByEmailRepositoryStub,
      createUserRepositoryStub,
      passwordHasherAdapterStub,
      idGeneratorAdapterStub,
      tokenGeneratorAdapter,
    };
  };

  it('should create a new user successfully', async () => {
    // arrange
    const { sut } = makeSut();

    // act
    const createdUser = await sut.execute(user);

    // assert
    expect(createdUser).toBeTruthy();
    expect(createdUser.tokens.accessToken).toBeDefined();
    expect(createdUser.tokens.refreshToken).toBeDefined();
  });

  it('should throw EmailAlreadyInUseError if GetUserByEmailRepository returns in user', async () => {
    // arrange
    const { sut, getUserByEmailRepositoryStub } = makeSut();
    import.meta.jest
      .spyOn(getUserByEmailRepositoryStub, 'execute')
      .mockReturnValueOnce(user);

    // act
    const promise = sut.execute(user);

    // assert
    await expect(promise).rejects.toThrow(
      new EmailAlreadyInUseError(user.email)
    );
  });

  it('should call IdGeneratorAdapter to generate random id', async () => {
    // arrange
    const { sut, idGeneratorAdapterStub, createUserRepositoryStub } = makeSut();
    const idGeneratorSpy = import.meta.jest.spyOn(
      idGeneratorAdapterStub,
      'execute'
    );
    const createdUserSpy = import.meta.jest.spyOn(
      createUserRepositoryStub,
      'execute'
    );

    // act
    await sut.execute(user);

    // assert
    expect(idGeneratorSpy).toHaveBeenCalled();
    expect(createdUserSpy).toHaveBeenCalledWith({
      ...user,
      id: 'generated-id',
      password: 'hashed-password',
    });
  });

  it('should call PasswordHasherAdapter to cryptograph password', async () => {
    // arrange
    const { sut, passwordHasherAdapterStub, createUserRepositoryStub } =
      makeSut();
    const passwordHasherSpy = import.meta.jest.spyOn(
      passwordHasherAdapterStub,
      'execute'
    );
    const createdUserSpy = import.meta.jest.spyOn(
      createUserRepositoryStub,
      'execute'
    );

    // act
    await sut.execute(user);

    // assert
    expect(passwordHasherSpy).toHaveBeenCalledWith(user.password);
    expect(createdUserSpy).toHaveBeenCalledWith({
      ...user,
      id: 'generated-id',
      password: 'hashed-password',
    });
  });

  it('should throw get if GetUserByEmailRepository throws', async () => {
    // arrange
    const { sut, getUserByEmailRepositoryStub } = makeSut();
    import.meta.jest
      .spyOn(getUserByEmailRepositoryStub, 'execute')
      .mockRejectedValueOnce(new Error());

    // act
    const promise = sut.execute(user);

    // assert
    await expect(promise).rejects.toThrow();
  });

  it('should throw get if IdGeneratorAdapter throws', async () => {
    // arrange
    const { sut, idGeneratorAdapterStub } = makeSut();
    import.meta.jest
      .spyOn(idGeneratorAdapterStub, 'execute')
      .mockImplementationOnce(() => {
        throw new Error();
      });

    // act
    const promise = sut.execute(user);

    // assert
    await expect(promise).rejects.toThrow();
  });

  it('should throw get if PasswordHasherAdapter throws', async () => {
    // arrange
    const { sut, passwordHasherAdapterStub } = makeSut();
    import.meta.jest
      .spyOn(passwordHasherAdapterStub, 'execute')
      .mockRejectedValueOnce(new Error());

    // act
    const promise = sut.execute(user);

    // assert
    await expect(promise).rejects.toThrow();
  });

  it('should throw get if CreateUserRepository throws', async () => {
    // arrange
    const { sut, createUserRepositoryStub } = makeSut();
    import.meta.jest
      .spyOn(createUserRepositoryStub, 'execute')
      .mockRejectedValueOnce(new Error());

    // act
    const promise = sut.execute(user);

    // assert
    await expect(promise).rejects.toThrow();
  });
});

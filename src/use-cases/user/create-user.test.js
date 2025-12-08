import { CreateUserUseCase } from './create-user';
import { faker } from '@faker-js/faker';
import { EmailAlreadyInUseError } from '../../errors/user';

describe('Create User Use Case', () => {
  // stubs
  class GetUserByEmailRepositoryStub {
    async execute() {
      return null;
    }
  }

  class CreateUserRepositoryStub {
    async execute(user) {
      return user;
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

  const user = {
    first_name: faker.person.firstName(),
    last_name: faker.person.lastName(),
    email: faker.internet.email(),
    password: faker.internet.password({
      length: 7,
    }),
  };

  const makeSut = () => {
    const getUserByEmailRepositoryStub = new GetUserByEmailRepositoryStub();
    const createUserRepositoryStub = new CreateUserRepositoryStub();
    const passwordHasherAdapterStub = new PasswordHasherAdapterStub();
    const idGeneratorAdapterStub = new IdGeneratorAdapterStub();

    const sut = new CreateUserUseCase(
      getUserByEmailRepositoryStub,
      createUserRepositoryStub,
      passwordHasherAdapterStub,
      idGeneratorAdapterStub
    );

    return {
      sut,
      getUserByEmailRepositoryStub,
      createUserRepositoryStub,
      passwordHasherAdapterStub,
      idGeneratorAdapterStub,
    };
  };

  it('should create a new user successfully', async () => {
    // arrange
    const { sut } = makeSut();

    // act
    const createdUser = await sut.execute(user);

    // assert
    expect(createdUser).toBeTruthy();
  });

  it('should throw EmailAlreadyInUseError if GetUserByEmailRepository returns in user', async () => {
    // arrange
    const { sut, getUserByEmailRepositoryStub } = makeSut();
    jest
      .spyOn(getUserByEmailRepositoryStub, 'execute')
      .mockReturnValueOnce(user);

    // act
    const promise = sut.execute(user);
    console.log(promise);

    // assert
    await expect(promise).rejects.toThrow(
      new EmailAlreadyInUseError(user.email)
    );
  });

  it('should call IdGeneratorAdapter to generate random id', async () => {
    // arrange
    const { sut, idGeneratorAdapterStub, createUserRepositoryStub } = makeSut();
    const idGeneratorSpy = jest.spyOn(idGeneratorAdapterStub, 'execute');
    const createdUserSpy = jest.spyOn(createUserRepositoryStub, 'execute');

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
    const passwordHasherSpy = jest.spyOn(passwordHasherAdapterStub, 'execute');
    const createdUserSpy = jest.spyOn(createUserRepositoryStub, 'execute');

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
    jest
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
    jest.spyOn(idGeneratorAdapterStub, 'execute').mockImplementationOnce(() => {
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
    jest
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
    jest
      .spyOn(createUserRepositoryStub, 'execute')
      .mockRejectedValueOnce(new Error());

    // act
    const promise = sut.execute(user);

    // assert
    await expect(promise).rejects.toThrow();
  });
});

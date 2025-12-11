import { faker } from '@faker-js/faker';
import { UpdateUserUseCase } from './update-user';
import { EmailAlreadyInUseError } from '../../errors/user';
import { user } from '../../tests';

describe('UpdateUserUseCase', () => {
  // stub
  class GetUserByEmailRepositoryStub {
    async execute() {
      return null;
    }
  }

  class UpdateUserRepositoryStub {
    async execute() {
      return user;
    }
  }

  class PasswordHasherAdapterStub {
    async execute() {
      return `hashed-password`;
    }
  }

  const makeSut = () => {
    const getUserByEmailRepository = new GetUserByEmailRepositoryStub();
    const updateUserRepository = new UpdateUserRepositoryStub();
    const passwordHasherAdapter = new PasswordHasherAdapterStub();

    const sut = new UpdateUserUseCase(
      getUserByEmailRepository,
      updateUserRepository,
      passwordHasherAdapter
    );

    return {
      sut,
      getUserByEmailRepository,
      updateUserRepository,
      passwordHasherAdapter,
    };
  };

  it('should update user successfully (without email e password)', async () => {
    // arrange
    const { sut } = makeSut();

    // act
    const result = await sut.execute(faker.string.uuid(), {
      first_name: faker.person.firstName(),
      last_name: faker.person.lastName(),
    });
    // assert
    expect(result).toBe(user);
  });

  it('should update user successfully (with email)', async () => {
    // arrange
    const { sut, getUserByEmailRepository } = makeSut();
    const getUserByEmailRepositorySpy = jest.spyOn(
      getUserByEmailRepository,
      'execute'
    );
    const email = faker.internet.email();

    // act
    const result = await sut.execute(faker.string.uuid(), {
      email,
    });

    // assert
    expect(getUserByEmailRepositorySpy).toHaveBeenCalledWith(email);
    expect(result).toBe(user);
  });

  it('should update user successfully (with password)', async () => {
    // arrange
    const { sut, passwordHasherAdapter } = makeSut();
    const passwordHasherAdapterSpy = jest.spyOn(
      passwordHasherAdapter,
      'execute'
    );
    const password = faker.internet.password({
      length: 7,
    });

    // act
    const result = await sut.execute(faker.string.uuid(), {
      password,
    });

    // assert
    expect(passwordHasherAdapterSpy).toHaveBeenCalledWith(password);
    expect(result).toBe(user);
  });

  it('should EmailAlreadyInUseError when email is already in use', async () => {
    // arrange
    const { sut, getUserByEmailRepository } = makeSut();
    jest.spyOn(getUserByEmailRepository, 'execute').mockReturnValueOnce(user);

    // act
    const promise = sut.execute(faker.string.uuid(), {
      email: user.email,
    });

    // assert
    await expect(promise).rejects.toThrow(
      new EmailAlreadyInUseError(user.email)
    );
  });

  it('should call UpdateUserRepository with correct values', async () => {
    // arrange
    const { sut, updateUserRepository } = makeSut();
    const updateUserRepositorySpy = jest.spyOn(updateUserRepository, 'execute');
    const updateUserParams = {
      first_name: faker.person.firstName(),
      last_name: faker.person.lastName(),
      email: faker.internet.email(),
      password: faker.internet.password({
        length: 7,
      }),
    };

    // act
    await sut.execute(user.id, updateUserParams);

    // assert
    expect(updateUserRepositorySpy).toHaveBeenCalledWith(user.id, {
      ...updateUserParams,
      password: 'hashed-password',
    });
  });

  it('should throw if GetUserByEmailRepository throws', async () => {
    // arrange
    const { sut, getUserByEmailRepository } = makeSut();
    jest
      .spyOn(getUserByEmailRepository, 'execute')
      .mockRejectedValueOnce(new Error());

    // act
    const promise = sut.execute(faker.string.uuid(), {
      email: faker.internet.email(),
    });

    // assert
    await expect(promise).rejects.toThrow();
  });

  it('should throw if PasswordHasherAdapter throws', async () => {
    // arrange
    const { sut, passwordHasherAdapter } = makeSut();
    jest
      .spyOn(passwordHasherAdapter, 'execute')
      .mockRejectedValueOnce(new Error());

    // act
    const promise = sut.execute(faker.string.uuid(), {
      password: faker.internet.password({
        length: 7,
      }),
    });

    // assert
    await expect(promise).rejects.toThrow();
  });

  it('should throw if UpdateUserRepository throws', async () => {
    // arrange
    const { sut, updateUserRepository } = makeSut();
    jest
      .spyOn(updateUserRepository, 'execute')
      .mockRejectedValueOnce(new Error());

    // act
    const promise = sut.execute(faker.string.uuid(), {
      first_name: faker.person.firstName(),
      last_name: faker.person.lastName(),
      email: faker.internet.email(),
      password: faker.internet.password({
        length: 7,
      }),
    });

    // assert
    await expect(promise).rejects.toThrow();
  });
});

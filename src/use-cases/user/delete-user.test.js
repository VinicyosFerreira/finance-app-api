import { faker } from '@faker-js/faker';
import { DeleteUserUseCase } from './delete-user.js';

describe('Delete User Use Case', () => {
  const user = {
    id: faker.string.uuid(),
    first_name: faker.person.firstName(),
    last_name: faker.person.lastName(),
    email: faker.internet.email(),
    password: faker.internet.password({
      length: 7,
    }),
  };

  // stub
  class DeleteUserRepositoryStub {
    async execute() {
      return user;
    }
  }

  const makeSut = () => {
    const deleteUserRepositoryStub = new DeleteUserRepositoryStub();
    const sut = new DeleteUserUseCase(deleteUserRepositoryStub);

    return {
      sut,
      deleteUserRepositoryStub,
    };
  };

  it('should delete a user successfully', async () => {
    // arrange
    const { sut } = makeSut();

    // act
    const deletedUser = await sut.execute(faker.string.uuid());

    // assert
    expect(deletedUser).toEqual(user);
  });

  it('should call DeleteUserRepository with correct user id', async () => {
    // arrange
    const { sut, deleteUserRepositoryStub } = makeSut();
    const deleteSpy = jest.spyOn(deleteUserRepositoryStub, 'execute');
    const userId = faker.string.uuid();

    // act
    await sut.execute(userId);

    // assert
    expect(deleteSpy).toHaveBeenCalledWith(userId);
  });

  it('should throw if DeleteUserRepository throws', async () => {
    // arrange
    const {sut , deleteUserRepositoryStub } = makeSut();
    jest.spyOn(deleteUserRepositoryStub, 'execute').mockRejectedValueOnce(new Error());

    // act
    const promise = sut.execute(faker.string.uuid());

    // assert
    await expect(promise).rejects.toThrow();
  });
});

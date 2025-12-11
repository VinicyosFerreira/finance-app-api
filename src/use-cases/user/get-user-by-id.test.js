import { faker } from '@faker-js/faker';
import { GetUserByIdUseCase } from './get-user-by-id';
import { user } from '../../tests';

describe('Get User By ID Use Case', () => {
  // stub
  class GetUserByIdRepositoryStub {
    async execute() {
      return user;
    }
  }

  const makeSut = () => {
    const getUserByIdRepository = new GetUserByIdRepositoryStub();
    const sut = new GetUserByIdUseCase(getUserByIdRepository);

    return { sut, getUserByIdRepository };
  };

  it('should get user by ID successfully', async () => {
    // arrange
    const { sut } = makeSut();

    // act
    const result = await sut.execute(faker.string.uuid());

    // assert
    expect(result).toEqual(user);
  });

  it('should call GetUserByIdRepository with correct user ID', async () => {
    // arrange
    const { sut, getUserByIdRepository } = makeSut();
    const executeSpy = jest.spyOn(getUserByIdRepository, 'execute');
    const userId = faker.string.uuid();

    // act
    await sut.execute(userId);

    // assert
    expect(executeSpy).toHaveBeenLastCalledWith(userId);
  });

  it('should throw if GetUserByIdRepository throws', async () => {
    // arrange
    const { sut, getUserByIdRepository } = makeSut();
    jest
      .spyOn(getUserByIdRepository, 'execute')
      .mockRejectedValueOnce(new Error());
    const userId = faker.string.uuid();

    // act
    const promise = sut.execute(userId);

    // assert
    await expect(promise).rejects.toThrow();
  });
});

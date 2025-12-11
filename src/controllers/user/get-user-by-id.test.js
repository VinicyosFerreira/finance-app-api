import { faker } from '@faker-js/faker';
import { GetUserByIdController } from './get-user-by-id';
import { user } from '../../tests';

describe('Get User By Id Controller', () => {
  // stub
  class GetUserByIdUseCase {
    async execute() {
      return user;
    }
  }

  // sut
  const makeSut = () => {
    const getUserByIdUseCaseStub = new GetUserByIdUseCase();
    const sut = new GetUserByIdController(getUserByIdUseCaseStub);

    return {
      sut,
      getUserByIdUseCaseStub,
    };
  };

  const httpRequest = {
    params: {
      userId: faker.string.uuid(),
    },
  };

  it('should return 200 if getting user is successful', async () => {
    // arrange
    const { sut } = makeSut();

    // result
    const result = await sut.execute(httpRequest);

    // assert
    expect(result.statusCode).toBe(200);
  });

  it('should return 400 if id is not valid', async () => {
    // arrang
    const { sut } = makeSut();

    // result
    const result = await sut.execute({
      params: {
        userId: 'invalid_id',
      },
    });

    // assert
    expect(result.statusCode).toBe(400);
  });

  it('should return 404 if user is not found', async () => {
    // arrange
    const { sut, getUserByIdUseCaseStub } = makeSut();

    jest.spyOn(getUserByIdUseCaseStub, 'execute').mockResolvedValueOnce(null);

    // act
    const result = await sut.execute({
      params: {
        userId: faker.string.uuid(),
      },
    });

    // assert
    expect(result.statusCode).toBe(404);
  });

  it('should return 500 if GetUserByIdUseCase throws', async () => {
    // arrange
    const { sut, getUserByIdUseCaseStub } = makeSut();

    jest
      .spyOn(getUserByIdUseCaseStub, 'execute')
      .mockRejectedValueOnce(new Error());

    // act
    const result = await sut.execute(httpRequest);

    // assert
    expect(result.statusCode).toBe(500);
  });

  it('should call GetUserByIdUseCase with correct params', async () => {
    // arrange
    const { sut, getUserByIdUseCaseStub } = makeSut();
    const executeSpy = jest.spyOn(getUserByIdUseCaseStub, 'execute');

    // act
    await sut.execute(httpRequest);

    // assert
    expect(executeSpy).toHaveBeenCalledWith(httpRequest.params.userId);
  });
});

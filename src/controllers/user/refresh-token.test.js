import { UnauthorizedError } from '../../errors/user.js';
import { RefreshTokenController } from './refresh-token.js';

describe('Refresh Token Controller', () => {
  class RefreshTokenUseCase {
    execute() {
      return {
        access_token: 'any_access_token',
        refresh_token: 'any_refresh_token',
      };
    }
  }
  const httpRequest = {
    body: {
      refresh_token: 'any_refresh_token',
    },
  };

  const makeSut = () => {
    const refreshTokenUseCase = new RefreshTokenUseCase();
    const sut = new RefreshTokenController(refreshTokenUseCase);

    return { sut, refreshTokenUseCase };
  };

  it('should return 200 if refresh token is valid', async () => {
    const { sut } = makeSut();

    const result = await sut.execute(httpRequest);

    expect(result.statusCode).toBe(200);
  });

  it('should return 400 if refresh token is not provided', async () => {
    const { sut } = makeSut();

    const result = await sut.execute({
      body: {
        refresh_token: undefined,
      },
    });

    expect(result.statusCode).toBe(400);
  });

  it('should return 401 if unauthorized should be thrown', async () => {
    const { sut, refreshTokenUseCase } = makeSut();
    import.meta.jest
      .spyOn(refreshTokenUseCase, 'execute')
      .mockImplementationOnce(() => {
        throw new UnauthorizedError();
      });

    const result = await sut.execute(httpRequest);

    expect(result.statusCode).toBe(401);
  });

  it('should return generic error if error should be thrown', async () => {
    const { sut, refreshTokenUseCase } = makeSut();
    import.meta.jest
      .spyOn(refreshTokenUseCase, 'execute')
      .mockImplementationOnce(() => {
        throw new Error();
      });

    const result = await sut.execute(httpRequest);

    expect(result.statusCode).toBe(500);
  });
});

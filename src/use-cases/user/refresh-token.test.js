import { RefreshTokenUseCase } from './refresh-token.js';
import { UnauthorizedError } from '../../errors/user.js';

describe('Refresh Token Use Case', () => {
  class TokenGeneratorAdapter {
    execute() {
      return {
        access_token: 'any_access_token',
        refresh_token: 'any_refresh_token',
      };
    }
  }

  class TokenVerifierAdapter {
    execute() {
      return true;
    }
  }

  const makeSut = () => {
    const tokenVerifierAdapter = new TokenVerifierAdapter();
    const tokenGeneratorAdapter = new TokenGeneratorAdapter();
    const sut = new RefreshTokenUseCase(
      tokenGeneratorAdapter,
      tokenVerifierAdapter
    );

    return {
      sut,
      tokenVerifierAdapter,
      tokenGeneratorAdapter,
    };
  };

  it('should return a new access token if refresh token is valid', async () => {
    const { sut } = makeSut();

    const result = sut.execute('valid_refresh_token');

    expect(result).toEqual({
      access_token: 'any_access_token',
      refresh_token: 'any_refresh_token',
    });
  });

  it('should throw if TokenVerifierAdapter throws', async () => {
    // arrange
    const { sut, tokenVerifierAdapter } = makeSut();
    import.meta.jest
      .spyOn(tokenVerifierAdapter, 'execute')
      .mockImplementationOnce(() => {
        throw new UnauthorizedError();
      });

    // assert and expect
    expect(() => {
      sut.execute('any_refresh_token');
    }).toThrow(new UnauthorizedError());
  });
});

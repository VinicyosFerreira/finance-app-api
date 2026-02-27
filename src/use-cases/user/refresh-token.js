import { UnauthorizedError } from '../../errors/user.js';

export class RefreshTokenUseCase {
  constructor(tokenGeneratorAdapter, tokenVerifierAdapter) {
    this.tokenGeneratorAdapter = tokenGeneratorAdapter;
    this.tokenVerifierAdapter = tokenVerifierAdapter;
  }

  execute(refreshToken) {
    const decodedToken = this.tokenVerifierAdapter.execute(
      refreshToken,
      process.env.JWT_REFRESH_TOKEN_SECRET
    );

    if (!decodedToken) {
      throw new UnauthorizedError();
    }

    return this.tokenGeneratorAdapter.execute(decodedToken.userId);
  }
}

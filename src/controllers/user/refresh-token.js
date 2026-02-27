import { badRequest, ok, serverError, unauthorized } from '../helpers/index.js';
import { refreshTokenSchema } from '../../schemas/user.js';
import { ZodError } from 'zod';
import { UnauthorizedError } from '../../errors/user.js';

export class RefreshTokenController {
  constructor(refreshTokenUseCase) {
    this.refreshTokenUseCase = refreshTokenUseCase;
  }

  async execute(httpRequest) {
    try {
      const params = httpRequest.body;

      await refreshTokenSchema.parseAsync(params);

      const token = this.refreshTokenUseCase.execute(params.refresh_token);

      return ok(token);
    } catch (error) {
      console.log(error);
      if (error instanceof ZodError) {
        return badRequest({ message: error.issues[0].message });
      }

      if (error instanceof UnauthorizedError) {
        return unauthorized({ message: error.message });
      }

      return serverError();
    }
  }
}

import {
  serverError,
  ok,
  badRequest,
  unauthorized,
  userNotFoundResponse,
} from '../helpers/index.js';
import { loginUserSchema } from '../../schemas/user.js';
import { ZodError } from 'zod';
import { InvalidPasswordError, UserNotFoundError } from '../../errors/index.js';

export class LoginUserController {
  constructor(loginUserUseCase) {
    this.loginUserUseCase = loginUserUseCase;
  }

  async execute(httpRequest) {
    try {
      const params = httpRequest.body;
      console.log(params);
      await loginUserSchema.parseAsync(params);
      const user = await this.loginUserUseCase.execute(
        params.email,
        params.password
      );
      return ok(user);
    } catch (error) {
      console.log(error);
      if (error instanceof ZodError) {
        return badRequest({ message: error.issues[0].message });
      }

      if (error instanceof UserNotFoundError) {
        return userNotFoundResponse();
      }

      if (error instanceof InvalidPasswordError) {
        return unauthorized({ message: error.message });
      }

      return serverError();
    }
  }
}

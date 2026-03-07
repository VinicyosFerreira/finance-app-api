import { UserNotFoundError } from '../../errors/user.js';
import {
  badRequest,
  ok,
  serverError,
  userNotFoundResponse,
} from '../helpers/index.js';
import { getBalanceSchema } from '../../schemas/user.js';
import { ZodError } from 'zod';

export class GetUserBalanceController {
  constructor(getUserBalanceUseCase) {
    this.getUserBalanceUseCase = getUserBalanceUseCase;
  }

  async execute(httpRequest) {
    try {
      const userId = httpRequest.params.userId;
      const from = httpRequest.query.from;
      const to = httpRequest.query.to;

      await getBalanceSchema.parseAsync({
        user_id: userId,
        from: from,
        to: to,
      });

      const balance = await this.getUserBalanceUseCase.execute(
        userId,
        from,
        to
      );

      return ok(balance);
    } catch (error) {
      if (error instanceof ZodError) {
        return badRequest({ message: error.issues[0].message });
      }
      if (error instanceof UserNotFoundError) {
        return userNotFoundResponse();
      }
      console.log(error);
      return serverError();
    }
  }
}

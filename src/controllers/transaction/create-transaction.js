import {
  serverError,
  created,
  badRequest,
  userNotFoundResponse,
} from '../helpers/index.js';
import { createTransactionSchema } from '../../schemas/index.js';
import { ZodError } from 'zod';
import { UserNotFoundError } from '../../errors/user.js';

export class CreateTransactionController {
  constructor(createTransactionUseCase) {
    this.createTransactionUseCase = createTransactionUseCase;
  }

  async execute(httpRequest) {
    try {
      const params = httpRequest.body;

      // validar a requisição com schemas utilizando Zod
      await createTransactionSchema.parseAsync(params);

      // chamar o useCase
      const createdTransaction =
        await this.createTransactionUseCase.execute(params);

      return created(createdTransaction);
    } catch (error) {
      if (error instanceof ZodError) {
        return badRequest({ message: error.issues[0].message });
      }

      if (error instanceof UserNotFoundError) {
        return userNotFoundResponse();
      }
      console.error(error);
      return serverError();
    }
  }
}

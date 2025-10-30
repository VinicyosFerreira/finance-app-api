import { EmailAlreadyInUseError } from '../../errors/user.js';
import {
  invalidIdResponse,
  checkIfIdIsValid,
  badRequest,
  ok,
  serverError,
} from '../helpers/index.js';
import { updateUserSchema } from '../../schemas/user.js';
import { ZodError } from 'zod';

export class UpdateUserController {
  constructor(updateUserUseCase) {
    this.updateUserUseCase = updateUserUseCase;
  }
  async execute(httpRequest) {
    try {
      // validar se o id passado é válido
      const userId = httpRequest.params.userId;
      const params = httpRequest.body;
      const isValidUUID = checkIfIdIsValid(userId);

      if (!isValidUUID) {
        return invalidIdResponse();
      }

      await updateUserSchema.parseAsync(params);

      const updatedUser = await this.updateUserUseCase.execute(userId, params);

      return ok(updatedUser);
    } catch (error) {
      console.log(error);

      if (error instanceof ZodError) {
        return badRequest({ message: error.issues[0].message });
      }
      if (error instanceof EmailAlreadyInUseError) {
        return badRequest({ message: error.message });
      }

      return serverError();
    }
  }
}

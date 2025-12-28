import {
  checkIfIdIsValid,
  invalidIdResponse,
  ok,
  serverError,
  userNotFoundResponse,
} from '../helpers/index.js';
import { UserNotFoundError } from '../../errors/index.js';

export class DeleteUserController {
  constructor(deleteUserUseCase) {
    this.deleteUserUseCase = deleteUserUseCase;
  }
  async execute(httpRequest) {
    try {
      const params = httpRequest.params.userId;

      const isValidId = checkIfIdIsValid(params);

      if (!isValidId) {
        return invalidIdResponse();
      }
      const deletedUser = await this.deleteUserUseCase.execute(params);

      return ok(deletedUser);
    } catch (error) {
      console.log(error);
      if (error instanceof UserNotFoundError) {
        return userNotFoundResponse();
      }

      return serverError();
    }
  }
}

import {
  checkIfIdIsValid,
  invalidIdResponse,
  ok,
  serverError,
  userNotFoundResponse,
} from './helpers/index.js';
import { DeleteUserUseCase } from '../use-cases/index.js';

export class DeleteUserController {
  async execute(httpRequest) {
    try {
      const params = httpRequest.params.userId;

      const isValidId = checkIfIdIsValid(params);

      if (!isValidId) {
        return invalidIdResponse();
      }

      const deleteUseCaseUser = new DeleteUserUseCase();
      const deletedUser = await deleteUseCaseUser.execute(params);

      if (!deletedUser) {
        return userNotFoundResponse();
      }

      return ok(deletedUser);
    } catch (error) {
      console.log(error);
      return serverError();
    }
  }
}

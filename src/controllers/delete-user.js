import {
  checkIfIdIsValid,
  invalidIdResponse,
  ok,
  serverError,
  userNotFoundResponse,
} from './helpers/index.js';

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

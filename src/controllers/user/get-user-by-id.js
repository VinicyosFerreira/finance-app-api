import {
  invalidIdResponse,
  checkIfIdIsValid,
  serverError,
  ok,
  userNotFoundResponse,
} from '../helpers/index.js';

export class GetUserByIdController {
  constructor(getUserByIdUseCase) {
    this.getUserByIdUseCase = getUserByIdUseCase;
  }

  async execute(httpRequest) {
    try {
      const params = httpRequest.params.userId;
      const isValidUUID = checkIfIdIsValid(params);

      if (!isValidUUID) {
        return invalidIdResponse();
      }

      const user = await this.getUserByIdUseCase.execute(params);

      if (!user) {
        return userNotFoundResponse();
      }

      return ok(user);
    } catch (error) {
      console.log(error);
      return serverError();
    }
  }
}

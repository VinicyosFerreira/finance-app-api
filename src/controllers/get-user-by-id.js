import { GetUserByIdUseCase } from '../use-cases/index.js';
import {
  invalidIdResponse,
  checkIfIdIsValid,
  serverError,
  ok,
  userNotFoundResponse,
} from './helpers/index.js';

export class GetUserByIdController {
  async execute(httpRequest) {
    try {
      const params = httpRequest.params.userId;
      const isValidUUID = checkIfIdIsValid(params);

      if (!isValidUUID) {
        return invalidIdResponse();
      }

      const getUserByIdUseCase = new GetUserByIdUseCase();
      const user = await getUserByIdUseCase.execute(params);

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

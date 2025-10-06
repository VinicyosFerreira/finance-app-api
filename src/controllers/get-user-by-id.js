import { serverError, ok, badRequest, notFound } from './helper.js';
import { GetUserByIdUseCase } from '../use-cases/get-user-by-id.js';
import validator from 'validator';
export class GetUserByIdController {
  async execute(httpRequest) {
    try {
      const params = httpRequest.params.userId;
      const isValidUUID = validator.isUUID(params);

      if (!isValidUUID) {
        return badRequest({ message: 'Invalid user id' });
      }

      const getUserByIdUseCase = new GetUserByIdUseCase();
      const user = await getUserByIdUseCase.execute(params);

      if (!user) {
        return notFound({ message: 'User not found' });
      }

      return ok(user);
    } catch (error) {
      console.log(error);
      return serverError();
    }
  }
}

import { serverError, ok, notFound } from './helper/http.js';
import { GetUserByIdUseCase } from '../use-cases/get-user-by-id.js';
import validator from 'validator';
import { invalidIdResponse } from './helper/user.js';

export class GetUserByIdController {
  async execute(httpRequest) {
    try {
      const params = httpRequest.params.userId;
      const isValidUUID = validator.isUUID(params);

      if (!isValidUUID) {
        return invalidIdResponse();
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

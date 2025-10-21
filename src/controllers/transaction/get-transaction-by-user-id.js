import {
  checkIfIdIsValid,
  invalidIdResponse,
  ok,
  requiredFieldsIsMissingResponse,
  serverError,
  userNotFoundResponse,
} from '../helpers/index.js';

import UserNotFoundError from '../../errors/user.js';

export class GetTransactionByUserIdController {
  constructor(getTransactionByUserIdUseCase) {
    this.getTransactionByUserIdUseCase = getTransactionByUserIdUseCase;
  }

  async execute(httpRequest) {
    try {
      const userId = httpRequest.query.userId;

      if (!userId) {
        return requiredFieldsIsMissingResponse('userId');
      }

      const userIsIdValid = checkIfIdIsValid(userId);

      if (!userIsIdValid) {
        return invalidIdResponse();
      }

      const transactions = await this.getTransactionByUserIdUseCase.execute({
        userId,
      });

      return ok(transactions);
    } catch (error) {
      console.log(error);
      if (error instanceof UserNotFoundError) {
        return userNotFoundResponse();
      }
      return serverError();
    }
  }
}

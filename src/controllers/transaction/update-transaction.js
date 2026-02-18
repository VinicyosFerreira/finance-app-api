import { ZodError } from 'zod';
import { updateTransactionSchema } from '../../schemas/transaction.js';
import {
  checkIfIdIsValid,
  invalidIdResponse,
  serverError,
  ok,
  badRequest,
  transactionNotFoundResponse,
  forbidden,
} from '../helpers/index.js';
import { TransactionNotFoundError } from '../../errors/transaction.js';
import { ForbiddenError } from '../../errors/user.js';

export class UpdateTransactionController {
  constructor(updateTransactionUseCase) {
    this.updateTransactionUseCase = updateTransactionUseCase;
  }

  async execute(httpRequest) {
    try {
      const transactionId = httpRequest.params.transactionId;
      const params = httpRequest.body;
      console.log(params);

      const isValidId = checkIfIdIsValid(transactionId);

      if (!isValidId) {
        return invalidIdResponse();
      }

      await updateTransactionSchema.parseAsync(params);

      const updateTransaction = await this.updateTransactionUseCase.execute(
        transactionId,
        params
      );

      return ok(updateTransaction);
    } catch (error) {
      console.log(error);
      if (error instanceof ZodError) {
        return badRequest({ message: error.issues[0].message });
      }

      if (error instanceof ForbiddenError) {
        return forbidden({ message: error.message });
      }

      if (error instanceof TransactionNotFoundError) {
        return transactionNotFoundResponse();
      }
      return serverError();
    }
  }
}

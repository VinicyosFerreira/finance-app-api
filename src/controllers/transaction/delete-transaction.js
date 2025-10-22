import {
  checkIfIdIsValid,
  invalidIdResponse,
  serverError,
  ok,
} from '../helpers/index.js';

export class DeleteTransactionController {
  constructor(deleteTransactionUseCase) {
    this.deleteTransactionUseCase = deleteTransactionUseCase;
  }

  async execute(httpRequest) {
    try {
      const transactionId = httpRequest.params.transactionId;

      const isValidId = checkIfIdIsValid(transactionId);

      if (!isValidId) {
        return invalidIdResponse();
      }

      const deleteTransaction =
        await this.deleteTransactionUseCase.execute(transactionId);

      return ok(deleteTransaction);
    } catch (error) {
      console.log(error);
      return serverError();
    }
  }
}

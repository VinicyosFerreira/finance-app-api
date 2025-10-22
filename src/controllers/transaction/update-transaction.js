import {
  checkIfIdIsValid,
  invalidIdResponse,
  serverError,
  badRequest,
  checkIfAmountIsValid,
  invalidAmountResponse,
  checkIfTypeIsValid,
  invalidTypeResponse,
  ok,
} from '../helpers/index.js';

export class UpdateTransactionController {
  constructor(updateTransactionUseCase) {
    this.updateTransactionUseCase = updateTransactionUseCase;
  }

  async execute(httpRequest) {
    try {
      const transactionId = httpRequest.params.transactionId;
      const params = httpRequest.body;

      const isValidId = checkIfIdIsValid(transactionId);

      if (!isValidId) {
        return invalidIdResponse();
      }

      // validar os campos se são válidos para realizar a alteração
      const allowFields = ['name', 'date', 'amount', 'type'];
      const someFieldIsNotAllow = Object.keys(params).some((field) => {
        return !allowFields.includes(field);
      });

      if (someFieldIsNotAllow) {
        return badRequest({ message: 'Some field is not allow' });
      }

      // validaçaõ do amount
      if (params.amount) {
        const amountIsValid = checkIfAmountIsValid(params.amount);

        if (!amountIsValid) {
          return invalidAmountResponse();
        }
      }

      // validação do type
      if (params.type) {
        const typeIsValid = checkIfTypeIsValid(params.type);

        if (!typeIsValid) {
          return invalidTypeResponse();
        }
      }

      const updateTransaction = await this.updateTransactionUseCase.execute(
        transactionId,
        params
      );

      return ok(updateTransaction);
    } catch (error) {
      console.log(error);
      serverError();
    }
  }
}

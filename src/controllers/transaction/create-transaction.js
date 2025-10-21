import {
  serverError,
  created,
  invalidAmountResponse,
  invalidTypeResponse,
  checkIfIdIsValid,
  invalidIdResponse,
  validateRequireFields,
  requiredFieldsIsMissingResponse,
  checkIfAmountIsValid,
  checkIfTypeIsValid,
} from '../helpers/index.js';

export class CreateTransactionController {
  constructor(createTransactionUseCase) {
    this.createTransactionUseCase = createTransactionUseCase;
  }

  async execute(httpRequest) {
    try {
      const params = httpRequest.body;

      // validar campos obrigatórios
      const requiredFields = ['user_id', 'name', 'date', 'amount', 'type'];
      const { missingField, ok: requiredFieldsWereProvided } =
        validateRequireFields(params, requiredFields);

      if (!requiredFieldsWereProvided) {
        return requiredFieldsIsMissingResponse(missingField);
      }

      // validar se usuário é valido
      const userIsValid = checkIfIdIsValid(params.user_id);
      if (!userIsValid) {
        return invalidIdResponse();
      }

      // validar casos decimais de amount
      const amountIsValid = checkIfAmountIsValid(params.amount);

      if (!amountIsValid) {
        return invalidAmountResponse();
      }

      const type = params.type.trim().toUpperCase();

      // validar tipo da transação
      const typeIsValid = checkIfTypeIsValid(type);

      if (!typeIsValid) {
        return invalidTypeResponse();
      }

      // chamar o useCase
      const createdTransaction = await this.createTransactionUseCase.execute({
        ...params,
        type,
      });

      return created(createdTransaction);
    } catch (error) {
      console.error(error);
      return serverError();
    }
  }
}

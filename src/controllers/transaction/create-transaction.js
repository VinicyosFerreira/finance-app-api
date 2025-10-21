import { serverError, badRequest, created } from '../helpers/index.js';
import {
  checkIfIdIsValid,
  invalidIdResponse,
  validateRequireFields,
  requiredFieldsIsMissingResponse,
} from '../helpers/index.js';
import validator from 'validator';
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
      const amountIsValid = validator.isCurrency(params.amount.toString(), {
        allow_negatives: false,
        digits_after_decimal: [2],
        decimal_separator: '.',
      });

      if (!amountIsValid) {
        return badRequest({ message: 'The amount must be a valid currency' });
      }

      const type = params.type.trim().toUpperCase();

      // validar tipo da transação
      const typeIsValid = ['EARNING', 'EXPENSE', 'INVESTMENT'].includes(type);

      if (!typeIsValid) {
        return badRequest({
          message: 'The type must be EARNING, EXPENSE or INVESTMENT',
        });
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

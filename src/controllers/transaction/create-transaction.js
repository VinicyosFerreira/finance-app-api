import { serverError, badRequest, created } from '../helpers/http.js';
import { checkIfIdIsValid, invalidIdResponse } from '../helpers/user.js';
import validator from 'validator';
export class CreateTransactionController {
  constructor(createTransactionUseCase) {
    this.createTransactionUseCase = createTransactionUseCase;
  }

  async execute(httpRequest) {
    try {
      const params = httpRequest.body;

      // validar campos obrigatórios
      const requiredFields = [
        'id',
        'user_id',
        'name',
        'date',
        'amount',
        'type',
      ];
      for (const field of requiredFields) {
        if (!params[field] || params[field].trim().length === 0) {
          return badRequest({ message: `Missing field: ${field}` });
        }
      }

      // validar se usuário é valido
      const userIsValid = checkIfIdIsValid(params.user_id);
      if (!userIsValid) {
        return invalidIdResponse();
      }

      // validar se o amount é maior que 0
      if (params.amount <= 0) {
        return badRequest({ message: 'Amount must be greater than 0' });
      }

      // validar casos decimais de amount
      const amountIsValid = validator.isCurrency(params.amount.toString(), {
        allow_negatives: false,
        digits_after_decimal: 2,
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

import { EmailAlreadyInUseError } from '../../errors/user.js';
import {
  invalidPasswordResponse,
  invalidEmailResponse,
  checkIfPasswordIsValid,
  checkIfEmailIsValid,
  badRequest,
  created,
  serverError,
  validateRequireFields,
} from '../helpers/index.js';

export class CreateUserController {
  constructor(createUserUseCase) {
    this.createUserUseCase = createUserUseCase;
  }
  async execute(httpRequest) {
    try {
      const params = httpRequest.body;

      // validar a requisição(campos obrigatórios, senha e e-mail)
      const requiredFields = ['first_name', 'last_name', 'email', 'password'];
      const { missingField, ok: requiredFieldsWereProvided } =
        validateRequireFields(params, requiredFields);

      if (!requiredFieldsWereProvided) {
        return badRequest({ message: `Missing field: ${missingField}` });
      }

      // validação de senha
      const passwordIsValid = checkIfPasswordIsValid(params.password);
      if (!passwordIsValid) {
        return invalidPasswordResponse();
      }

      // validação de email
      const isEmailValid = checkIfEmailIsValid(params.email);
      if (!isEmailValid) {
        return invalidEmailResponse();
      }

      // chamar o useCase
      const createdUser = await this.createUserUseCase.execute(params);

      // retornar o resultado para client(usuário)
      return created(createdUser);
    } catch (error) {
      console.log(error);

      if (error instanceof EmailAlreadyInUseError) {
        return badRequest({ message: error.message });
      }
      return serverError();
    }
  }
}

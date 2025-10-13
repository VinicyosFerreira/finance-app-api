import { EmailAlreadyInUseError } from '../errors/user.js';
import {
  invalidPasswordResponse,
  invalidEmailResponse,
  invalidIdResponse,
  checkIfIdIsValid,
  checkIfPasswordIsValid,
  checkIfEmailIsValid,
  badRequest,
  ok,
  serverError,
} from './helpers/index.js';

export class UpdateUserController {
  constructor(updateUserUseCase) {
    this.updateUserUseCase = updateUserUseCase;
  }
  async execute(httpRequest) {
    try {
      // validar se o id passado é válido
      const userId = httpRequest.params.userId;
      const isValidUUID = checkIfIdIsValid(userId);

      if (!isValidUUID) {
        return invalidIdResponse();
      }

      const params = httpRequest.body;

      // validar os campos se são válidos para realizar a alteração
      const allowFields = ['first_name', 'last_name', 'email', 'password'];
      const someFieldIsNotAllow = Object.keys(params).some((field) => {
        return !allowFields.includes(field);
      });

      if (someFieldIsNotAllow) {
        return badRequest({ message: 'Some field is not allow' });
      }

      // validação de senha
      if (params.password) {
        const passwordIsNotValid = checkIfPasswordIsValid(params.password);
        if (!passwordIsNotValid) {
          return invalidPasswordResponse();
        }
      }

      // validação de email
      if (params.email) {
        const isEmailValid = checkIfEmailIsValid(params.email);
        if (!isEmailValid) {
          return invalidEmailResponse();
        }
      }

      // chamar o useCase
      const updatedUser = await this.updateUserUseCase.execute(userId, params);

      return ok(updatedUser);
    } catch (error) {
      console.log(error);
      if (error instanceof EmailAlreadyInUseError) {
        return badRequest({ message: error.message });
      }

      return serverError();
    }
  }
}

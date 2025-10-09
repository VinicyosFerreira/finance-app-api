import { badRequest, ok, serverError } from './helper.js';
import validator from 'validator';
import { UpdateUserUseCase } from '../use-cases/update-user.js';
import { EmailAlreadyInUseError } from '../errors/user.js';

export class UpdateUserController {
  async execute(httpRequest) {
    try {
      // validar se o id passado é válido
      const userId = httpRequest.params.userId;
      const isValidUUID = validator.isUUID(userId);

      if (!isValidUUID) {
        return badRequest({ message: 'Invalid user id' });
      }

      const userParams = httpRequest.body;
      console.log(userParams);

      // validar os campos se são válidos para realizar a alteração
      const allowFields = ['first_name', 'last_name', 'email', 'password'];
      const someFieldIsNotAllow = Object.keys(userParams).some((field) => {
        return !allowFields.includes(field);
      });

      if (someFieldIsNotAllow) {
        return badRequest({ message: 'Some field is not allow' });
      }

      // validação de senha
      if (userParams.password) {
        const passwordIsNotValid = userParams.password.length < 6;
        if (passwordIsNotValid) {
          return badRequest({
            message: 'Password must be at least 6 characters',
          });
        }
      }

      // validação de email
      if (userParams.email) {
        const isEmailValid = validator.isEmail(userParams.email);
        if (!isEmailValid) {
          return badRequest({ message: 'Invalid email' });
        }
      }

      // chamar o useCase
      const updateUserUseCase = new UpdateUserUseCase();
      const updatedUser = await updateUserUseCase.execute(userId, userParams);

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

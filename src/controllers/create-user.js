import { CreateUserUseCase } from '../use-cases/create-user.js';
import validator from 'validator';
import { badRequest, created, serverError } from './helper.js';
import { EmailAlreadyInUseError } from '../errors/user.js';

export class CreateUserController {
  async execute(httpRequest) {
    try {
      const params = httpRequest.body;

      // validar a requisição(campos obrigatórios, tamanho de senha e e-mail)
      const requiredFields = ['first_name', 'last_name', 'email', 'password'];
      for (const field of requiredFields) {
        if (!params[field] || params[field].trim().length === 0) {
          return badRequest({ message: `Missing field: ${field}` });
        }
      }

      // validação de senha
      const passwordIsValid = params.password.length < 6;
      if (passwordIsValid) {
        return badRequest({
          message: 'Password must be at least 6 characters',
        });
      }

      // validação de email
      const isEmailValid = validator.isEmail(params.email);
      if (!isEmailValid) {
        return badRequest({ message: 'Invalid email' });
      }

      // chamar o useCase
      const createdUserUseCase = new CreateUserUseCase();
      const createdUser = await createdUserUseCase.execute(params);

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

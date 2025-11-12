import { EmailAlreadyInUseError } from '../../errors/user.js';
import { createUserSchema } from '../../schemas/index.js';
import { badRequest, created, serverError } from '../helpers/index.js';
import { ZodError } from 'zod';

export class CreateUserController {
  constructor(createUserUseCase) {
    this.createUserUseCase = createUserUseCase;
  }

  async execute(httpRequest) {
    try {
      const params = httpRequest.body;

      // validar a requisição com schemas e utilizando o Zod
      await createUserSchema.parseAsync(params);

      // chamar o useCase
      const createdUser = await this.createUserUseCase.execute(params);

      // retornar o resultado para client(usuário)
      return created(createdUser);
    } catch (error) {
      if (error instanceof ZodError) {
        return badRequest({ message: error.issues[0].message });
      }

      if (error instanceof EmailAlreadyInUseError) {
        return badRequest({ message: error.message });
      }
      return serverError();
    }
  }
}

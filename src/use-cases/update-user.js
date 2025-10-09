import { EmailAlreadyInUseError } from '../errors/user.js';
import bcrypt from 'bcrypt';
import {
  PostgresUpdateUserRepository,
  PostgresGetUserByEmailRepository,
} from '../repositories/postgres/index.js';

export class UpdateUserUseCase {
  async execute(userId, updateUserParams) {
    // verificar se e-mail está em uso , após atualizar
    if (updateUserParams.email) {
      const postgresGetUserByEmailRepository =
        new PostgresGetUserByEmailRepository();
      const userWithProvidedEmail =
        await postgresGetUserByEmailRepository.execute(updateUserParams.email);

      if (userWithProvidedEmail && userWithProvidedEmail.id !== userId) {
        throw new EmailAlreadyInUseError(updateUserParams.email);
      }
    }

    // validar password existe e criptografar com bcrypt
    if (updateUserParams.password) {
      const hashedPassword = await bcrypt.hash(updateUserParams.password, 10);
      updateUserParams.password = hashedPassword;
    }

    // chamar repository para atualizar usuário
    const postgresUpdateUserRepository = new PostgresUpdateUserRepository();
    const updateUser = postgresUpdateUserRepository.execute(
      userId,
      updateUserParams
    );
    return updateUser;
  }
}

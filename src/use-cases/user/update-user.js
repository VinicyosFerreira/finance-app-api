import { EmailAlreadyInUseError } from '../../errors/user.js';
import bcrypt from 'bcrypt';
export class UpdateUserUseCase {
  constructor(getUserByEmailRepository, updateUserRepository) {
    this.updateUserRepository = updateUserRepository;
    this.getUserByEmailRepository = getUserByEmailRepository;
  }
  async execute(userId, updateUserParams) {
    // verificar se e-mail está em uso , após atualizar
    if (updateUserParams.email) {
      const userWithProvidedEmail = await this.getUserByEmailRepository.execute(
        updateUserParams.email
      );

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
    const updateUser = await this.updateUserRepository.execute(
      userId,
      updateUserParams
    );
    return updateUser;
  }
}

import { v4 as uuid } from 'uuid';
import bycrypt from 'bcrypt';
import { PostgresCreateUserRepository } from '../repositories/postgres/create-user.js';
import { PostgresGetUserByEmailRepository } from '../repositories/postgres/get-user-by-email.js';
import { EmailAlreadyInUseError } from '../errors/user.js';

export class CreateUserUseCase {
  async execute(createUserParams) {
    const postgresGetUserByEmailRepository =
      new PostgresGetUserByEmailRepository();
    const userWithProvidedEmail =
      await postgresGetUserByEmailRepository.execute(createUserParams.email);

    if (userWithProvidedEmail) {
      throw new EmailAlreadyInUseError(createUserParams.email);
    }

    // gerar ID do usuário
    const userId = uuid();

    // criptografar a senha
    const hashedPassoword = await bycrypt.hash(createUserParams.password, 10);

    // inserir usuário no banco
    const user = {
      ...createUserParams,
      id: userId,
      password: hashedPassoword,
    };

    // inserir no banco
    const postgresCreateUserRepository = new PostgresCreateUserRepository();
    const createdUser = await postgresCreateUserRepository.execute(user);

    return createdUser;
  }
}

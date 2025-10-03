import uuidv4 from 'uuid/v4';
import bycrypt from 'bcrypt';
import { PostgresCreateUserRepository } from '../repositories/postgres/create-user.js';

export class CreateUserUseCase {
  async execute(createUserParams) {
    // TODO:  verificar se email já está em uso

    // gerar ID do usuário
    const userId = uuidv4();

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

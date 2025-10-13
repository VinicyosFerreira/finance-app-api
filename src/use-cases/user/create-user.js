import { v4 as uuid } from 'uuid';
import bycrypt from 'bcrypt';
import { EmailAlreadyInUseError } from '../../errors/user.js';

export class CreateUserUseCase {
  constructor(getUserByEmailRepository, createUserRepository) {
    this.createUserRepository = createUserRepository;
    this.getUserByEmailRepository = getUserByEmailRepository;
  }
  async execute(createUserParams) {
    const userWithProvidedEmail = await this.getUserByEmailRepository.execute(
      createUserParams.email
    );

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
    const createdUser = await this.createUserRepository.execute(user);

    return createdUser;
  }
}

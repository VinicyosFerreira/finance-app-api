import { v4 as uuid } from 'uuid';
import { EmailAlreadyInUseError } from '../../errors/user.js';

export class CreateUserUseCase {
  constructor(
    getUserByEmailRepository,
    createUserRepository,
    passwordHasherAdapter
  ) {
    this.createUserRepository = createUserRepository;
    this.getUserByEmailRepository = getUserByEmailRepository;
    this.passwordHasherAdapter = passwordHasherAdapter;
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
    const hashedPassoword = await this.passwordHasherAdapter.execute(
      createUserParams.password
    );

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

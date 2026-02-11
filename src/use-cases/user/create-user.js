import { EmailAlreadyInUseError } from '../../errors/user.js';

export class CreateUserUseCase {
  constructor(
    getUserByEmailRepository,
    createUserRepository,
    passwordHasherAdapter,
    idGeneratorAdapter,
    tokenGeneratorAdapter
  ) {
    this.createUserRepository = createUserRepository;
    this.getUserByEmailRepository = getUserByEmailRepository;
    this.passwordHasherAdapter = passwordHasherAdapter;
    this.idGeneratorAdapter = idGeneratorAdapter;
    this.tokenGeneratorAdapter = tokenGeneratorAdapter;
  }
  async execute(createUserParams) {
    const userWithProvidedEmail = await this.getUserByEmailRepository.execute(
      createUserParams.email
    );

    if (userWithProvidedEmail) {
      throw new EmailAlreadyInUseError(createUserParams.email);
    }

    // gerar ID do usuário
    const userId = this.idGeneratorAdapter.execute();

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
    const tokens = this.tokenGeneratorAdapter.execute(userId);

    return {
      ...createdUser,
      tokens: tokens,
    };
  }
}

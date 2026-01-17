import { InvalidPasswordError, UserNotFoundError } from '../../errors/index.js';

export class LoginUserUseCase {
  constructor(
    getUserByEmailRepository,
    passwordComparatorAdapter,
    tokenGeneratorAdapter
  ) {
    this.getUserByEmailRepository = getUserByEmailRepository;
    this.passwordComparatorAdapter = passwordComparatorAdapter;
    this.tokenGeneratorAdapter = tokenGeneratorAdapter;
  }
  async execute(email, password) {
    // validar esse email se ele existe no banco
    const user = await this.getUserByEmailRepository.execute(email);

    if (!user) {
      throw new UserNotFoundError();
    }

    // se ele existir, validar se a senha esta correta
    const isValidPassword = await this.passwordComparatorAdapter.execute(
      password,
      user.password
    );
    if (!isValidPassword) {
      throw new InvalidPasswordError();
    }

    // depois gerar o token jwt
    const tokens = this.tokenGeneratorAdapter.execute(user.id);
    // retornar os dados do usuário com token
    return {
      ...user,
      tokens,
    };
  }
}

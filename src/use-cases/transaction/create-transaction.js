import { UserNotFoundError } from '../../errors/user.js';

export class CreateTransactionUseCase {
  constructor(
    createTransactionRepository,
    getUserByIdRepository,
    idGeneratorAdapter
  ) {
    this.createTransactionRepository = createTransactionRepository;
    this.getUserByIdRepository = getUserByIdRepository;
    this.idGeneratorAdapter = idGeneratorAdapter;
  }

  async execute(createTransactionParams) {
    // validar se usuario existe
    const userId = createTransactionParams.user_id;
    const user = await this.getUserByIdRepository.execute(userId);

    if (!user) {
      throw new UserNotFoundError(userId);
    }

    // gerar o id via uuid
    const transactionId = this.idGeneratorAdapter.execute();

    // chamar repository para criar transação
    const createdTransaction = await this.createTransactionRepository.execute({
      ...createTransactionParams,
      id: transactionId,
    });

    return createdTransaction;
  }
}

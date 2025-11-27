import { UserNotFoundError } from '../../errors/user.js';

export class GetTransactionUserByIdUseCase {
  constructor(getTransactionByUserIdRepository, getUserByIdRepository) {
    this.getTransactionByUserIdRepository = getTransactionByUserIdRepository;
    this.getUserByIdRepository = getUserByIdRepository;
  }
  async execute(userId) {
    const user = await this.getUserByIdRepository.execute(userId);

    if (!user) {
      throw new UserNotFoundError(userId);
    }

    const getTransaction =
      await this.getTransactionByUserIdRepository.execute(userId);

    return getTransaction;
  }
}

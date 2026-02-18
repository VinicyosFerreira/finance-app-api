import { ForbiddenError } from '../../errors/index.js';
export class UpdateTransactionUseCase {
  constructor(updateTransactionRepository, getTransactionByIdRepository) {
    this.updateTransactionRepository = updateTransactionRepository;
    this.getTransactionByIdRepository = getTransactionByIdRepository;
  }

  async execute(transactionId, params) {
    const transactionById =
      await this.getTransactionByIdRepository.execute(transactionId);

    if (params?.user_id && transactionById.user_id !== params.user_id) {
      throw new ForbiddenError();
    }

    const transaction = await this.updateTransactionRepository.execute(
      transactionId,
      params
    );

    return transaction;
  }
}

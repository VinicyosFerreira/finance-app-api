import { PostgresDeleteUserRepository } from '../repositories/postgres/index.js';

export class DeleteUserUseCase {
  async execute(userId) {
    const postgresDeleteUserRepository = await PostgresDeleteUserRepository();
    return await postgresDeleteUserRepository.execute(userId);
  }
}

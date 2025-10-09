import { PostgresGetUserByIdRepository } from '../repositories/postgres/index.js';

export class GetUserByIdUseCase {
  async execute(userId) {
    const postgresGetUserByIdRepository = new PostgresGetUserByIdRepository();
    const user = await postgresGetUserByIdRepository.execute(userId);
    return user;
  }
}

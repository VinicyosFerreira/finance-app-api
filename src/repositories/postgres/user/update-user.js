import { PrismaClientKnownRequestError } from '@prisma/client/runtime/client';
import { UserNotFoundError } from '../../../errors/user.js';
import { prisma } from '../../../../prisma/prisma.js';

export class PostgresUpdateUserRepository {
  async execute(userId, updateUserParams) {
    try {
      return await prisma.user.update({
        where: {
          id: userId,
        },
        data: updateUserParams,
      });
    } catch (error) {
      console.log(error);
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new UserNotFoundError(userId);
        }
      }
      throw error;
    }
  }
}

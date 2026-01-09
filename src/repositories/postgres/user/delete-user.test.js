import { PostgresDeleteUserRepository } from './delete-user.js';
import { user } from '../../../tests/index.js';
import { prisma } from '../../../../prisma/prisma';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/client';
import { UserNotFoundError } from '../../../errors/user.js';

describe('Delete User Repository', () => {
  it('should delete a user on database', async () => {
    await prisma.user.create({ data: user });
    const sut = new PostgresDeleteUserRepository();
    const result = await sut.execute(user.id);
    expect(result).toStrictEqual(user);
  });

  it('should call Prisma with correct values', async () => {
    await prisma.user.create({ data: user });
    const prismaSpy = import.meta.jest.spyOn(prisma.user, 'delete');
    const sut = new PostgresDeleteUserRepository();
    await sut.execute(user.id);
    expect(prismaSpy).toHaveBeenCalledWith({
      where: {
        id: user.id,
      },
    });
  });

  it('should throw generic error if user does not exist', async () => {
    const sut = new PostgresDeleteUserRepository();
    import.meta.jest
      .spyOn(prisma.user, 'delete')
      .mockRejectedValueOnce(new Error());
    const promise = sut.execute(user.id);
    await expect(promise).rejects.toThrow();
  });

  it('should throw UserNotFoundError if user does not exist', async () => {
    const sut = new PostgresDeleteUserRepository();
    import.meta.jest.spyOn(prisma.user, 'delete').mockRejectedValueOnce(
      new PrismaClientKnownRequestError('', {
        code: 'P2025',
      })
    );
    const promise = sut.execute(user.id);
    await expect(promise).rejects.toThrow(new UserNotFoundError(user.id));
  });
});

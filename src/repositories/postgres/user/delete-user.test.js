import { PostgresDeleteUserRepository } from './delete-user.js';
import { user } from '../../../tests/index.js';
import { prisma } from '../../../../prisma/prisma';

describe('Delete User Repository', () => {
  it('should delete a user on database', async () => {
    await prisma.user.create({ data: user });
    const sut = new PostgresDeleteUserRepository();
    const result = await sut.execute(user.id);
    expect(result).toStrictEqual(user);
  });

  it('should call Prisma with correct values', async () => {
    await prisma.user.create({ data: user });
    const prismaSpy = jest.spyOn(prisma.user, 'delete');
    const sut = new PostgresDeleteUserRepository();
    await sut.execute(user.id);
    expect(prismaSpy).toHaveBeenCalledWith({
      where: {
        id: user.id,
      },
    });
  });
});

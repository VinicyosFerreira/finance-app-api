import { PostgresDeleteUserRepository } from './delete-user.js';
import { user } from '../../../tests/index.js';
import { prisma } from '../../../../prisma/prisma';

describe('Delete User Repository', () => {
  it('should delete a user on database', async () => {
    const createdUser = await prisma.user.create({ data: user });
    const sut = new PostgresDeleteUserRepository();
    const result = await sut.execute(createdUser.id);
    expect(result).toStrictEqual(createdUser);
  });

  it('should call Prisma with correct params', async () => {
    const sut = new PostgresDeleteUserRepository();
    const prismaSpy = jest.spyOn(prisma.user, 'delete');
    await sut.execute(user.id);

    expect(prismaSpy).toHaveBeenCalledWith({
      where: {
        id: user.id,
      },
    });
  });
});

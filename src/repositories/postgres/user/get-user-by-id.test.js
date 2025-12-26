import { prisma } from '../../../../prisma/prisma';
import { user as fakeUser } from '../../../tests';
import { PostgresGetUserByIdRepository } from './get-user-by-id.js';

describe('Get User By Id Repository', () => {
  it('should get user by id on db', async () => {
    const user = await prisma.user.create({ data: fakeUser });
    const sut = new PostgresGetUserByIdRepository();

    const result = await sut.execute(user.id);

    expect(result).toStrictEqual(user);
  });

  it('should call prisma with correct values', async () => {
    const sut = new PostgresGetUserByIdRepository();
    const prismaSpy = jest.spyOn(prisma.user, 'findUnique');

    await sut.execute(fakeUser.id);
    expect(prismaSpy).toHaveBeenCalledWith({
      where: {
        id: fakeUser.id,
      },
    });
  });

  it('should throw if Prisma throws', async () => {
    const sut = new PostgresGetUserByIdRepository();
    jest.spyOn(prisma.user, 'findUnique').mockRejectedValueOnce(new Error());

    const promise = sut.execute(fakeUser.id);

    await expect(promise).rejects.toThrow();
  });
});

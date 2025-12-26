import { prisma } from '../../../../prisma/prisma';
import { user as FakeUser } from '../../../tests/index.js';
import { PostgresGetUserByEmailRepository } from './get-user-by-email.js';

describe('Get User By Email Repository', () => {
  it('should get user by email on db', async () => {
    const user = await prisma.user.create({ data: FakeUser });
    const sut = new PostgresGetUserByEmailRepository();

    const result = await sut.execute(user.email);

    expect(result).toStrictEqual(user);
  });

  it('should call prisma with correct values', async () => {
    const sut = new PostgresGetUserByEmailRepository();
    const prismaSpy = jest.spyOn(prisma.user, 'findUnique');

    await sut.execute(FakeUser.email);

    expect(prismaSpy).toHaveBeenCalledWith({
      where: {
        email: FakeUser.email,
      },
    });
  });

  it('should throw if Prisma throws', async () => {
    const sut = new PostgresGetUserByEmailRepository();
    jest.spyOn(prisma.user, 'findUnique').mockRejectedValueOnce(new Error());

    const promise = sut.execute(FakeUser.email);

    await expect(promise).rejects.toThrow();
  });
});

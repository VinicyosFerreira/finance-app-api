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
});

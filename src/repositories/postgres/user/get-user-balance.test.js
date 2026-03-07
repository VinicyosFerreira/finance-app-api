import { prisma } from '../../../../prisma/prisma';
import { user as fakeUser } from '../../../tests/index.js';
import { faker } from '@faker-js/faker';
import { PostgresGetUserBalanceRepository } from './get-user-balance.js';
import { TransactionType } from '../../../generated/prisma/client.js';

describe('Get User Balance Repository', () => {
  const from = '2022-01-01';
  const to = '2022-12-31';

  it('should get user balance on db', async () => {
    const user = await prisma.user.create({ data: fakeUser });

    await prisma.transaction.createMany({
      data: [
        {
          name: faker.string.sample(),
          amount: 5000,
          date: new Date(from),
          type: 'EARNING',
          user_id: user.id,
        },
        {
          name: faker.string.sample(),
          date: new Date(from),
          amount: 5000,
          type: 'EARNING',
          user_id: user.id,
        },
        {
          name: faker.string.sample(),
          date: new Date(from),
          amount: 1000,
          type: 'EXPENSE',
          user_id: user.id,
        },
        {
          name: faker.string.sample(),
          date: new Date(to),
          amount: 1000,
          type: 'EXPENSE',
          user_id: user.id,
        },
        {
          name: faker.string.sample(),
          date: new Date(to),
          amount: 3000,
          type: 'INVESTMENT',
          user_id: user.id,
        },
        {
          name: faker.string.sample(),
          date: new Date(to),
          amount: 3000,
          type: 'INVESTMENT',
          user_id: user.id,
        },
      ],
    });

    const sut = new PostgresGetUserBalanceRepository();

    const result = await sut.execute(user.id, from, to);

    expect(result.earnings.toString()).toBe('10000');
    expect(result.expenses.toString()).toBe('2000');
    expect(result.investments.toString()).toBe('6000');
    expect(result.balance.toString()).toBe('2000');
  });

  it('should call Prisma with correct values', async () => {
    await prisma.user.create({ data: fakeUser });
    const prismaSpy = import.meta.jest.spyOn(prisma.transaction, 'aggregate');

    const sut = new PostgresGetUserBalanceRepository();

    await sut.execute(fakeUser.id, from, to);

    const dateFilter = {
      date: {
        gte: new Date(from),
        lte: new Date(to),
      },
    };

    expect(prismaSpy).toHaveBeenCalledTimes(3);
    expect(prismaSpy).toHaveBeenCalledWith({
      where: {
        user_id: fakeUser.id,
        type: TransactionType.EARNING,
        ...dateFilter,
      },
      _sum: {
        amount: true,
      },
    });
    expect(prismaSpy).toHaveBeenCalledWith({
      where: {
        user_id: fakeUser.id,
        type: TransactionType.EXPENSE,
        ...dateFilter,
      },
      _sum: {
        amount: true,
      },
    });
    expect(prismaSpy).toHaveBeenCalledWith({
      where: {
        user_id: fakeUser.id,
        type: TransactionType.INVESTMENT,
        ...dateFilter,
      },
      _sum: {
        amount: true,
      },
    });
  });

  it('should throw if Prisma throws', async () => {
    const sut = new PostgresGetUserBalanceRepository();
    import.meta.jest
      .spyOn(prisma.transaction, 'aggregate')
      .mockRejectedValueOnce(new Error());

    const promise = sut.execute(fakeUser.id, from, to);

    await expect(promise).rejects.toThrow();
  });
});

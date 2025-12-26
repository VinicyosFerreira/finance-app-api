import { prisma } from '../../../../prisma/prisma';
import { user as fakeUser } from '../../../tests/index.js';
import { faker } from '@faker-js/faker';
import { PostgresGetUserBalanceRepository } from './get-user-balance.js';
import { TransactionType } from '../../../generated/prisma/client.js';

describe('Get User Balance Repository', () => {
  it('should get user balance on db', async () => {
    const user = await prisma.user.create({ data: fakeUser });

    await prisma.transaction.createMany({
      data: [
        {
          name: faker.string.sample(),
          amount: 5000,
          date: faker.date.recent(),
          type: 'EARNING',
          user_id: user.id,
        },
        {
          name: faker.string.sample(),
          date: faker.date.recent(),
          amount: 5000,
          type: 'EARNING',
          user_id: user.id,
        },
        {
          name: faker.string.sample(),
          date: faker.date.recent(),
          amount: 1000,
          type: 'EXPENSE',
          user_id: user.id,
        },
        {
          name: faker.string.sample(),
          date: faker.date.recent(),
          amount: 1000,
          type: 'EXPENSE',
          user_id: user.id,
        },
        {
          name: faker.string.sample(),
          date: faker.date.recent(),
          amount: 3000,
          type: 'INVESTMENT',
          user_id: user.id,
        },
        {
          name: faker.string.sample(),
          date: faker.date.recent(),
          amount: 3000,
          type: 'INVESTMENT',
          user_id: user.id,
        },
      ],
    });

    const sut = new PostgresGetUserBalanceRepository();

    const result = await sut.execute(user.id);

    expect(result.earnings.toString()).toBe('10000');
    expect(result.expenses.toString()).toBe('2000');
    expect(result.investments.toString()).toBe('6000');
    expect(result.balance.toString()).toBe('2000');
  });

  it('should call Prisma with correct values', async () => {
    await prisma.user.create({ data: fakeUser });
    const prismaSpy = jest.spyOn(prisma.transaction, 'aggregate');

    const sut = new PostgresGetUserBalanceRepository();

    await sut.execute(fakeUser.id);

    expect(prismaSpy).toHaveBeenCalledTimes(3);
    expect(prismaSpy).toHaveBeenCalledWith({
      where: {
        user_id: fakeUser.id,
        type: TransactionType.EARNING,
      },
      _sum: {
        amount: true,
      },
    });
    expect(prismaSpy).toHaveBeenCalledWith({
      where: {
        user_id: fakeUser.id,
        type: TransactionType.EXPENSE,
      },
      _sum: {
        amount: true,
      },
    });
    expect(prismaSpy).toHaveBeenCalledWith({
      where: {
        user_id: fakeUser.id,
        type: TransactionType.INVESTMENT,
      },
      _sum: {
        amount: true,
      },
    });
  });
});

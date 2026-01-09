import { PostgresUpdateTransactionRepository } from './update-transaction.js';
import { user, transaction } from '../../../tests/index.js';
import { prisma } from '../../../../prisma/prisma.js';
import dayjs from 'dayjs';
import { faker } from '@faker-js/faker';
import { TransactionType } from '../../../generated/prisma/client.js';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/client';
import { TransactionNotFoundError } from '../../../errors/transaction.js';

describe('Update Transaction Repository', () => {
  it('should update transaction on db', async () => {
    await prisma.user.create({ data: user });
    await prisma.transaction.create({
      data: {
        ...transaction,
        user_id: user.id,
      },
    });

    const sut = new PostgresUpdateTransactionRepository();

    const updateTransactionParams = {
      id: transaction.id,
      user_id: user.id,
      name: faker.commerce.productName(),
      date: faker.date.anytime().toISOString(),
      amount: Number(faker.finance.amount()),
      type: TransactionType.EXPENSE,
    };

    const result = await sut.execute(transaction.id, updateTransactionParams);

    expect(result.name).toBe(updateTransactionParams.name);
    expect(result.user_id).toBe(user.id);
    expect(String(result.amount)).toBe(String(updateTransactionParams.amount));
    expect(result.type).toBe(updateTransactionParams.type);
    expect(dayjs(result.date).daysInMonth()).toBe(
      dayjs(updateTransactionParams.date).daysInMonth()
    );
    expect(dayjs(result.date).month()).toBe(
      dayjs(updateTransactionParams.date).month()
    );
    expect(dayjs(result.date).year()).toBe(
      dayjs(updateTransactionParams.date).year()
    );
  });

  it('should call prisma.transaction.update with correct values', async () => {
    await prisma.user.create({ data: user });
    await prisma.transaction.create({
      data: {
        ...transaction,
        user_id: user.id,
      },
    });
    const sut = new PostgresUpdateTransactionRepository();
    const prismaSpy = import.meta.jest.spyOn(prisma.transaction, 'update');

    await sut.execute(transaction.id, {
      ...transaction,
      user_id: user.id,
    });

    expect(prismaSpy).toHaveBeenCalledWith({
      where: {
        id: transaction.id,
      },
      data: {
        ...transaction,
        user_id: user.id,
      },
    });
  });

  it('should throw if prisma throws', async () => {
    const sut = new PostgresUpdateTransactionRepository();
    import.meta.jest
      .spyOn(prisma.transaction, 'update')
      .mockRejectedValueOnce(new Error());
    const promise = sut.execute(transaction.id, {
      ...transaction,
      user_id: user.id,
    });
    await expect(promise).rejects.toThrow();
  });

  it('should throw TransactionNotFoundError if transaction does not exist', async () => {
    const sut = new PostgresUpdateTransactionRepository();
    import.meta.jest.spyOn(prisma.transaction, 'update').mockRejectedValueOnce(
      new PrismaClientKnownRequestError('', {
        code: 'P2025',
      })
    );

    const promise = sut.execute(transaction.id);

    await expect(promise).rejects.toThrow(
      new TransactionNotFoundError(transaction.id)
    );
  });
});

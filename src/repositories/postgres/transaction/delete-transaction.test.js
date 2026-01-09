import { PostgresDeleteTransactionRepository } from './delete-transaction.js';
import { user as fakeUser, transaction } from '../../../tests/index.js';
import { prisma } from '../../../../prisma/prisma.js';
import dayjs from 'dayjs';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/client';
import { TransactionNotFoundError } from '../../../errors/transaction.js';

describe('Delete Transaction Repository', () => {
  it('should delete a transaction from db', async () => {
    const user = await prisma.user.create({
      data: fakeUser,
    });
    await prisma.transaction.create({
      data: { ...transaction, user_id: user.id },
    });

    const sut = new PostgresDeleteTransactionRepository();

    const result = await sut.execute(transaction.id);

    expect(result).not.toBeNull();
    expect(result.name).toBe(transaction.name);
    expect(result.user_id).toBe(user.id);
    expect(String(result.amount)).toBe(String(transaction.amount));
    expect(result.type).toBe(transaction.type);
    expect(dayjs(result.date).daysInMonth()).toBe(
      dayjs(transaction.date).daysInMonth()
    );
    expect(dayjs(result.date).month()).toBe(dayjs(transaction.date).month());
    expect(dayjs(result.date).year()).toBe(dayjs(transaction.date).year());
  });

  it('should call with correct values', async () => {
    await prisma.user.create({
      data: fakeUser,
    });
    await prisma.transaction.create({
      data: { ...transaction, user_id: fakeUser.id },
    });
    const sut = new PostgresDeleteTransactionRepository();
    const prismaSpy = import.meta.jest.spyOn(prisma.transaction, 'delete');

    await sut.execute(transaction.id);

    expect(prismaSpy).toHaveBeenCalledWith({
      where: { id: transaction.id },
    });
  });

  it('should throw generic error if transaction does not exist', async () => {
    const sut = new PostgresDeleteTransactionRepository();
    import.meta.jest
      .spyOn(prisma.transaction, 'delete')
      .mockRejectedValueOnce(new Error());
    const promise = sut.execute(transaction.id);

    await expect(promise).rejects.toThrow();
  });

  it('should throw TransactionNotFoundError if transaction does not exist', async () => {
    const sut = new PostgresDeleteTransactionRepository();
    import.meta.jest.spyOn(prisma.transaction, 'delete').mockRejectedValueOnce(
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

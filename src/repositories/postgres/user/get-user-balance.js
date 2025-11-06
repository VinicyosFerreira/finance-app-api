import { prisma } from '../../../../prisma/prisma.js';
import { Prisma } from '../../../generated/prisma/client.js';

export class PostgresGetUserBalanceRepository {
  async execute(userId) {
    const totalEarnings = await prisma.transaction.aggregate({
      where: {
        user_id: userId,
        type: 'EARNING',
      },
      _sum: {
        amount: true,
      },
    });

    const totalExpenses = await prisma.transaction.aggregate({
      where: {
        user_id: userId,
        type: 'EXPENSE',
      },
      _sum: {
        amount: true,
      },
    });

    const totalInvestments = await prisma.transaction.aggregate({
      where: {
        user_id: userId,
        type: 'INVESTMENT',
      },
      _sum: {
        amount: true,
      },
    });

    const _totalEarnings = totalEarnings._sum.amount || new Prisma.Decimal(0);
    const _totalExpenses = totalExpenses._sum.amount || new Prisma.Decimal(0);
    const _totalInvestments =
      totalInvestments._sum.amount || new Prisma.Decimal(0);
    const balance = new Prisma.Decimal(
      _totalEarnings - _totalExpenses - _totalInvestments
    );

    return {
      earnings: _totalEarnings,
      expenses: _totalExpenses,
      investments: _totalInvestments,
      balance,
    };
  }
}

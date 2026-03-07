import { prisma } from '../../../../prisma/prisma.js';
import { Prisma } from '../../../generated/prisma/client.js';

export class PostgresGetUserBalanceRepository {
  async execute(userId, from, to) {
    const dateFilter = {
      date: {
        gte: new Date(from),
        lte: new Date(to),
      },
    };
    const totalEarnings = await prisma.transaction.aggregate({
      where: {
        user_id: userId,
        type: 'EARNING',
        ...dateFilter,
      },
      _sum: {
        amount: true,
      },
    });

    const totalExpenses = await prisma.transaction.aggregate({
      where: {
        user_id: userId,
        type: 'EXPENSE',
        ...dateFilter,
      },
      _sum: {
        amount: true,
      },
    });

    const totalInvestments = await prisma.transaction.aggregate({
      where: {
        user_id: userId,
        type: 'INVESTMENT',
        ...dateFilter,
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

import { Prisma } from '@prisma/client'
import { prisma } from '../../../../prisma/prisma.js'

export class PostgresGetUserBalanceRepository {
    async execute(userId) {
        const {
            _sum: { amount: _totalExpenses },
        } = await prisma.transaction.aggregate({
            where: { user_id: userId, type: 'EXPENSE' },
            _sum: { amount: true },
        })

        const {
            _sum: { amount: _totalEarnings },
        } = await prisma.transaction.aggregate({
            where: { user_id: userId, type: 'EARNING' },
            _sum: { amount: true },
        })

        const {
            _sum: { amount: _totalInvestments },
        } = await prisma.transaction.aggregate({
            where: { user_id: userId, type: 'INVESTMENT' },
            _sum: { amount: true },
        })

        const balance = new Prisma.Decimal(
            _totalEarnings - _totalExpenses - _totalInvestments,
        )

        return {
            totalEarnings: _totalEarnings || new Prisma.Decimal(0),
            totalExpenses: _totalExpenses || new Prisma.Decimal(0),
            totalInvestments: _totalInvestments || new Prisma.Decimal(0),
            balance,
        }
    }
}

import { prisma } from '../../../../prisma/prisma.js'
import { user as fakerUser } from '../../../tests/index'
import { PostgresGetUserBalanceRepository } from './get-user-balance.js'
import { TransactionType } from '@prisma/client'

describe('GetUserBalanceRepository', () => {
    const from = '2024-01-01'
    const to = '2024-01-31'

    it('should get user balance', async () => {
        const user = await prisma.user.create({
            data: fakerUser,
        })

        await prisma.transaction.createMany({
            data: [
                {
                    user_id: user.id,
                    name: 'Salario',
                    date: new Date(from),
                    type: 'EARNING',
                    amount: 200,
                },
                {
                    user_id: user.id,
                    name: 'Compras',
                    date: new Date(to),
                    type: 'EXPENSE',
                    amount: 50,
                },
                {
                    user_id: user.id,
                    name: 'Investimentos',
                    date: new Date(from),
                    type: 'INVESTMENT',
                    amount: 50,
                },
            ],
        })

        const sut = new PostgresGetUserBalanceRepository()

        const result = await sut.execute(user.id, from, to)

        expect(result.totalEarnings.toString()).toBe('200')
        expect(result.totalExpenses.toString()).toBe('50')
        expect(result.totalInvestments.toString()).toBe('50')
        expect(result.balance.toString()).toBe('100')
    })

    it('Should call Prisma with correct params', async () => {
        const user = await prisma.user.create({
            data: fakerUser,
        })

        const sut = new PostgresGetUserBalanceRepository()
        const executeSpy = import.meta.jest.spyOn(
            prisma.transaction,
            'aggregate',
        )

        await sut.execute(user.id, from, to)

        expect(executeSpy).toHaveBeenCalledTimes(3)
        expect(executeSpy).toHaveBeenCalledWith({
            where: {
                user_id: user.id,
                type: TransactionType.EARNING,
                date: {
                    gte: new Date(from),
                    lte: new Date(to),
                },
            },
            _sum: {
                amount: true,
            },
        })

        expect(executeSpy).toHaveBeenCalledWith({
            where: {
                user_id: user.id,
                type: TransactionType.EXPENSE,
                date: {
                    gte: new Date(from),
                    lte: new Date(to),
                },
            },
            _sum: {
                amount: true,
            },
        })

        expect(executeSpy).toHaveBeenCalledWith({
            where: {
                user_id: user.id,
                type: TransactionType.INVESTMENT,
                date: {
                    gte: new Date(from),
                    lte: new Date(to),
                },
            },
            _sum: {
                amount: true,
            },
        })
    })

    it('should throw Prisma throws', async () => {
        const sut = new PostgresGetUserBalanceRepository()
        import.meta.jest
            .spyOn(prisma.transaction, 'aggregate')
            .mockRejectedValueOnce(new Error())

        const promise = sut.execute(fakerUser.id, from, to)

        await expect(promise).rejects.toThrow()
    })
})

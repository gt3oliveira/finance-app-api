import { prisma } from '../../../../prisma/prisma.js'
import { user as fakerUser } from '../../../tests/index'
import { PostgresGetUserBalanceRepository } from './get-user-balance.js'
import { TransactionType } from '@prisma/client'

describe('GetUserBalanceRepository', () => {
    it('should get user balance', async () => {
        const user = await prisma.user.create({
            data: fakerUser,
        })

        await prisma.transaction.createMany({
            data: [
                {
                    user_id: user.id,
                    name: 'Salario',
                    date: new Date(),
                    type: 'EARNING',
                    amount: 200,
                },
                {
                    user_id: user.id,
                    name: 'Compras',
                    date: new Date(),
                    type: 'EXPENSE',
                    amount: 50,
                },
                {
                    user_id: user.id,
                    name: 'Investimentos',
                    date: new Date(),
                    type: 'INVESTMENT',
                    amount: 50,
                },
            ],
        })

        const sut = new PostgresGetUserBalanceRepository()

        const result = await sut.execute(user.id)

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

        await sut.execute(user.id)

        expect(executeSpy).toHaveBeenCalledTimes(3)
        expect(executeSpy).toHaveBeenCalledWith({
            where: {
                user_id: user.id,
                type: TransactionType.EARNING,
            },
            _sum: {
                amount: true,
            },
        })

        expect(executeSpy).toHaveBeenCalledWith({
            where: {
                user_id: user.id,
                type: TransactionType.EXPENSE,
            },
            _sum: {
                amount: true,
            },
        })

        expect(executeSpy).toHaveBeenCalledWith({
            where: {
                user_id: user.id,
                type: TransactionType.INVESTMENT,
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

        const promise = sut.execute(fakerUser.id)

        await expect(promise).rejects.toThrow()
    })
})

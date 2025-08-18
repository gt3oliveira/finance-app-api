import { PostgresGetTransactionByUserIdRepository } from './get-transaction-by-user-id.js'
import { user, transaction } from '../../../tests/index'
import { prisma } from '../../../../prisma/prisma.js'
import dayjs from 'dayjs'

/* eslint-disable no-undef */
describe('GetTransactionByUserIdRepository', () => {
    it('should get transaction by user id', async () => {
        const sut = new PostgresGetTransactionByUserIdRepository()
        await prisma.user.create({ data: user })
        await prisma.transaction.create({
            data: { ...transaction, user_id: user.id },
        })

        const result = await sut.execute(user.id)

        expect(result.length).toBe(1)
        expect(result[0].id).toBe(transaction.id)
        expect(result[0].name).toBe(transaction.name)
        expect(result[0].type).toBe(transaction.type)
        expect(String(result[0].amount)).toBe(String(transaction.amount))
        expect(dayjs(result[0].date).daysInMonth()).toBe(
            dayjs(transaction.date).daysInMonth(),
        )
        expect(dayjs(result[0].date).month()).toBe(
            dayjs(transaction.date).month(),
        )
        expect(dayjs(result[0].date).year()).toBe(
            dayjs(transaction.date).year(),
        )
    })

    it('should call Prisma with correct params', async () => {
        const sut = new PostgresGetTransactionByUserIdRepository()
        await prisma.user.create({ data: user })
        await prisma.transaction.create({
            data: { ...transaction, user_id: user.id },
        })
        const executeSpy = import.meta.jest.spyOn(
            prisma.transaction,
            'findMany',
        )

        await sut.execute(user.id)

        expect(executeSpy).toHaveBeenCalledWith({
            where: { user_id: user.id },
        })
    })

    it('should throw Prisma throws', async () => {
        const sut = new PostgresGetTransactionByUserIdRepository()
        import.meta.jest
            .spyOn(prisma.transaction, 'findMany')
            .mockRejectedValueOnce(new Error())

        const promise = sut.execute(user.id)

        await expect(promise).rejects.toThrow()
    })
})

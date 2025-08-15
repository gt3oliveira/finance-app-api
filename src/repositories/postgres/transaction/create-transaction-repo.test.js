/* eslint-disable no-undef */
import { PostgresCreateTransactionRepository } from './create-transaction.js'
import { prisma } from '../../../../prisma/prisma.js'
import { transaction, user as fakeUser } from '../../../tests/index.js'
import dayjs from 'dayjs'

describe('CreateTransactionRepository', () => {
    it('should create a transaction', async () => {
        const user = await prisma.user.create({
            data: fakeUser,
        })
        const sut = new PostgresCreateTransactionRepository()

        const result = await sut.execute({ ...transaction, user_id: user.id })

        expect(result).not.toBeNull()
        expect(result.user_id).toBe(user.id)
        expect(result.id).toBe(transaction.id)
        expect(result.name).toBe(transaction.name)
        expect(result.type).toBe(transaction.type)
        expect(String(result.amount)).toBe(String(transaction.amount))
        expect(dayjs(result.date).daysInMonth()).toBe(
            dayjs(transaction.date).daysInMonth(),
        )
        expect(dayjs(result.date).month()).toBe(dayjs(transaction.date).month())
        expect(dayjs(result.date).year()).toBe(dayjs(transaction.date).year())
    })

    it('should throw Prisma throws', async () => {
        const sut = new PostgresCreateTransactionRepository()
        jest.spyOn(prisma.transaction, 'create').mockRejectedValueOnce(
            new Error(),
        )

        const promise = sut.execute(transaction)

        await expect(promise).rejects.toThrow()
    })

    it('should call Prisma with correct params', async () => {
        const user = await prisma.user.create({
            data: fakeUser,
        })
        const sut = new PostgresCreateTransactionRepository()
        const executeSpy = jest.spyOn(prisma.transaction, 'create')

        await sut.execute({ ...transaction, user_id: user.id })

        expect(executeSpy).toHaveBeenCalledWith({
            data: {
                ...transaction,
                user_id: user.id,
            },
        })
    })
})

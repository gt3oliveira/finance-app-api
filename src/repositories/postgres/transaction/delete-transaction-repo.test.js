/* eslint-disable no-undef */
import { PostgresDeleteTransactionRepository } from './delete-transaction.js'
import { prisma } from '../../../../prisma/prisma.js'
import { transaction, user } from '../../../tests/index.js'
import dayjs from 'dayjs'
import { TransactionNotFoundError } from '../../../errors/index.js'
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library.js'

describe('DeleteTransactionRepository', () => {
    it('should delete a transaction', async () => {
        await prisma.user.create({
            data: user,
        })
        await prisma.transaction.create({
            data: { ...transaction, user_id: user.id },
        })
        const sut = new PostgresDeleteTransactionRepository()

        const result = await sut.execute(transaction.id)

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

    it('should call Prisma with correct params', async () => {
        await prisma.user.create({
            data: user,
        })
        await prisma.transaction.create({
            data: { ...transaction, user_id: user.id },
        })

        const sut = new PostgresDeleteTransactionRepository()
        const executeSpy = import.meta.jest.spyOn(prisma.transaction, 'delete')

        await sut.execute(transaction.id)

        expect(executeSpy).toHaveBeenCalledWith({
            where: { id: transaction.id },
        })
    })

    it('should throw Prisma on TransactionNotFoundError throws', async () => {
        const sut = new PostgresDeleteTransactionRepository()
        import.meta.jest
            .spyOn(prisma.transaction, 'delete')
            .mockRejectedValueOnce(
                new PrismaClientKnownRequestError('', {
                    code: 'P2025',
                }),
            )

        const promise = sut.execute(transaction.id)

        await expect(promise).rejects.toThrow(
            new TransactionNotFoundError(transaction.id),
        )
    })

    it('should throw Prisma throws', async () => {
        const sut = new PostgresDeleteTransactionRepository()
        import.meta.jest
            .spyOn(prisma.transaction, 'delete')
            .mockRejectedValueOnce(new Error())

        const promise = sut.execute(transaction.id)

        await expect(promise).rejects.toThrow()
    })
})

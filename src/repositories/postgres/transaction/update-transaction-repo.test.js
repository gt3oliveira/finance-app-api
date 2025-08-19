import { PostgresUpdateTransactionRepository } from './update-transaction.js'
import { prisma } from '../../../../prisma/prisma.js'
import { user, transaction } from '../../../tests/index.js'
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library.js'
import { TransactionNotFoundError } from '../../../errors/transaction.js'

describe('UpdateTransactionRepository', () => {
    it('should update a transaction', async () => {
        await prisma.user.create({
            data: user,
        })
        await prisma.transaction.create({
            data: { ...transaction, user_id: user.id },
        })
        const sut = new PostgresUpdateTransactionRepository()

        const result = await sut.execute(transaction.id, {
            name: 'any_name',
        })

        expect(result.name).toBe('any_name')
    })

    it('should call Prisma with correct params', async () => {
        await prisma.user.create({
            data: user,
        })
        await prisma.transaction.create({
            data: { ...transaction, user_id: user.id },
        })
        const sut = new PostgresUpdateTransactionRepository()
        const executeSpy = import.meta.jest.spyOn(prisma.transaction, 'update')

        await sut.execute(transaction.id, {
            name: 'any_name',
        })

        expect(executeSpy).toHaveBeenCalledWith({
            where: { id: transaction.id },
            data: {
                name: 'any_name',
            },
        })
    })

    it('should throw Prisma throws', async () => {
        const sut = new PostgresUpdateTransactionRepository()
        import.meta.jest
            .spyOn(prisma.transaction, 'update')
            .mockRejectedValueOnce(new Error())

        const promise = sut.execute(transaction.id, {
            name: 'any_name',
        })

        await expect(promise).rejects.toThrow()
    })

    it('should throw Prisma on TransactionNotFoundError throws', async () => {
        const sut = new PostgresUpdateTransactionRepository()
        import.meta.jest
            .spyOn(prisma.transaction, 'update')
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
})

import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library.js'
import { prisma } from '../../../../prisma/prisma.js'
import { TransactionNotFoundError } from '../../../errors/transaction.js'

export class PostgresUpdateTransactionRepository {
    async execute(transactionId, updateTransactionParams) {
        try {
            const transaction = await prisma.transaction.update({
                where: { id: transactionId },
                data: updateTransactionParams,
            })

            return transaction
        } catch (error) {
            if (error instanceof PrismaClientKnownRequestError) {
                if (error.code === 'P2025') {
                    throw new TransactionNotFoundError(transactionId)
                }
            }

            throw error
        }
    }
}

import { prisma } from '../../../../prisma/prisma.js'

export class PostgresGetTransactionByUserIdRepository {
    async execute(userId, from, to) {
        const transactions = await prisma.transaction.findMany({
            where: {
                user_id: userId,
                date: {
                    gte: new Date(from),
                    lte: new Date(to),
                },
            },
        })

        return transactions
    }
}

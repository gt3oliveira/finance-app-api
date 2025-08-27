import { ZodError } from 'zod'
import { TransactionNotFoundError } from '../../errors/transaction.js'
import { getTransactionsParamsSchema } from '../../schemas/transaction.js'
import {
    badRequest,
    ok,
    serverError,
    transactionNotFound,
} from '../helpers/index.js'

export class DeleteTransactionController {
    constructor(deleteTransactionUseCase) {
        this.deleteTransactionUseCase = deleteTransactionUseCase
    }

    async execute(httpRequest) {
        try {
            const transactionId = httpRequest.params.transactionId
            const userId = httpRequest.params.user_id

            await getTransactionsParamsSchema.parseAsync({
                transactionId,
                userId,
            })

            const deletedTransaction =
                await this.deleteTransactionUseCase.execute(
                    transactionId,
                    userId,
                )

            return ok(deletedTransaction)
        } catch (error) {
            console.log('<< Error in DeleteTransactionController >>', error)

            if (error instanceof ZodError) {
                return badRequest({
                    message: error.issues[0].message,
                })
            }

            if (error instanceof TransactionNotFoundError) {
                return transactionNotFound()
            }

            return serverError()
        }
    }
}

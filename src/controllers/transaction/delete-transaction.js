import { TransactionNotFoundError } from '../../errors/transaction.js'
import {
    checkIfIdIsValid,
    invalidIdResponse,
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
            const idIsValid = checkIfIdIsValid(httpRequest.params.transactionId)

            if (!idIsValid) {
                return invalidIdResponse()
            }

            const deletedTransaction =
                await this.deleteTransactionUseCase.execute(
                    httpRequest.params.transactionId,
                )

            return ok(deletedTransaction)
        } catch (error) {
            console.log('<< Error in DeleteTransactionController >>', error)

            if (error instanceof TransactionNotFoundError) {
                return transactionNotFound()
            }

            return serverError()
        }
    }
}

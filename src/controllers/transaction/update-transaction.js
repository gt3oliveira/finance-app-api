import { ZodError } from 'zod'
import { updateTransactionSchema } from '../../schemas/index.js'
import {
    badRequest,
    checkIfIdIsValid,
    forbidden,
    invalidIdResponse,
    ok,
    serverError,
    transactionNotFound,
} from '../helpers/index.js'
import { TransactionNotFoundError } from '../../errors/transaction.js'
import { ForbiddenError } from '../../errors/index.js'

export class UpdateTransactionController {
    constructor(UpdateTransactionUseCase) {
        this.updateTransactionUseCase = UpdateTransactionUseCase
    }

    async execute(httpRequest) {
        try {
            const idIsValid = checkIfIdIsValid(httpRequest.params.transactionId)

            if (!idIsValid) {
                return invalidIdResponse()
            }

            const params = httpRequest.body

            await updateTransactionSchema.parseAsync(params)

            const updatedTransaction =
                await this.updateTransactionUseCase.execute(
                    httpRequest.params.transactionId,
                    params,
                )

            return ok(updatedTransaction)
        } catch (error) {
            console.log('<< Error in UpdateTransactionController >>', error)

            if (error instanceof ZodError) {
                return badRequest({
                    message: error.issues[0].message,
                })
            }

            if (error instanceof TransactionNotFoundError) {
                return transactionNotFound()
            }

            if (error instanceof ForbiddenError) {
                return forbidden()
            }

            return serverError()
        }
    }
}

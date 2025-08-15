export class UpdateTransactionUseCase {
    constructor(updateTransactionRepository) {
        this.updateTransactionRepository = updateTransactionRepository
    }

    async execute(transactionId, params) {
        const updatedTransaction =
            await this.updateTransactionRepository.execute(
                transactionId,
                params,
            )

        return updatedTransaction
    }
}

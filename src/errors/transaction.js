export class TransactionNotFoundError extends Error {
    constructor(transactionId) {
        super(`Transaction with ID ${transactionId} was not found.`)
        this.name = 'TransactionNotFoundError'
    }
}

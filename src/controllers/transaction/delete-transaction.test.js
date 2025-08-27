import { DeleteTransactionController } from './delete-transaction.js'
import { transaction } from '../../tests/index.js'
import { TransactionNotFoundError } from '../../errors/transaction.js'

describe('DeleteTransactionController', () => {
    class deleteTransactionUseCaseStub {
        async execute() {
            return transaction
        }
    }

    const makSut = () => {
        const deleteTransactionUseCase = new deleteTransactionUseCaseStub()
        const sut = new DeleteTransactionController(deleteTransactionUseCase)

        return {
            sut,
            deleteTransactionUseCase,
        }
    }

    const httpRequest = {
        params: {
            transactionId: transaction.id,
            user_id: transaction.user_id,
        },
    }

    it('Should return 200 on success', async () => {
        const { sut } = makSut()

        const httpResponse = await sut.execute(httpRequest)

        expect(httpResponse.statusCode).toBe(200)
    })

    it('Should return 400 on invalid id', async () => {
        const { sut } = makSut()

        const httpResponse = await sut.execute({
            params: {
                transactionId: 'invalid_id',
            },
        })

        expect(httpResponse.statusCode).toBe(400)
    })

    it('Should return 404 on transaction not found', async () => {
        const { sut, deleteTransactionUseCase } = makSut()

        import.meta.jest
            .spyOn(deleteTransactionUseCase, 'execute')
            .mockRejectedValueOnce(new TransactionNotFoundError())

        const httpResponse = await sut.execute(httpRequest)

        expect(httpResponse.statusCode).toBe(404)
    })

    it('Should return 500 on server error', async () => {
        const { sut, deleteTransactionUseCase } = makSut()

        import.meta.jest
            .spyOn(deleteTransactionUseCase, 'execute')
            .mockRejectedValueOnce(new Error())

        const httpResponse = await sut.execute(httpRequest)

        expect(httpResponse.statusCode).toBe(500)
    })

    it('Should call DeleteTransactionUseCase with correct params', async () => {
        const { sut, deleteTransactionUseCase } = makSut()

        const executeSpy = import.meta.jest.spyOn(
            deleteTransactionUseCase,
            'execute',
        )

        await sut.execute({
            params: httpRequest.params,
        })

        expect(executeSpy).toHaveBeenCalledWith(
            httpRequest.params.transactionId,
            httpRequest.params.user_id,
        )
    })
})

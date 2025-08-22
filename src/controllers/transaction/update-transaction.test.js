import { TransactionNotFoundError } from '../../errors/transaction.js'
import { transaction } from '../../tests/index.js'
import { UpdateTransactionController } from './update-transaction.js'

describe('UpdateTransactionController', () => {
    class UpdateTransactionUseCaseStub {
        async execute() {
            return transaction
        }
    }

    const makSut = () => {
        const useCase = new UpdateTransactionUseCaseStub()
        const sut = new UpdateTransactionController(useCase)

        return {
            sut,
            useCase,
        }
    }

    const httpRequest = {
        params: {
            transactionId: transaction.id,
        },
        body: {
            name: transaction.name,
            date: transaction.date,
            type: transaction.type,
            amount: transaction.amount,
        },
    }

    it('Should return 200 on transaction updated', async () => {
        const { sut } = makSut()

        const httpResponse = await sut.execute(httpRequest)

        expect(httpResponse.statusCode).toBe(200)
    })

    it('Should return 400 if transaction_id is invalid', async () => {
        const { sut } = makSut()

        const httpResponse = await sut.execute({
            params: {
                transactionId: 'invalid_id',
            },
        })

        expect(httpResponse.statusCode).toBe(400)
    })

    it('Should return 400 if amount invalid', async () => {
        const { sut } = makSut()

        const httpResponse = await sut.execute({
            params: httpRequest.params,
            body: {
                amount: 'invalid_amount',
            },
        })

        expect(httpResponse.statusCode).toBe(400)
    })

    it('Should return 400 if type invalid', async () => {
        const { sut } = makSut()

        const httpResponse = await sut.execute({
            params: httpRequest.params,
            body: {
                type: 'invalid_amount',
            },
        })

        expect(httpResponse.statusCode).toBe(400)
    })

    it('Should return 400 if date invalid', async () => {
        const { sut } = makSut()

        const httpResponse = await sut.execute({
            params: httpRequest.params,
            body: {
                date: 'invalid_amount',
            },
        })

        expect(httpResponse.statusCode).toBe(400)
    })

    it('Should return 400 if name invalid', async () => {
        const { sut } = makSut()

        const httpResponse = await sut.execute({
            params: httpRequest.params,
            body: {
                name: ' ',
            },
        })

        expect(httpResponse.statusCode).toBe(400)
    })

    it('Should return 500 if server error in UpdateTransactionUseCase', async () => {
        const { sut, useCase } = makSut()

        import.meta.jest
            .spyOn(useCase, 'execute')
            .mockRejectedValueOnce(new Error())

        const httpResponse = await sut.execute(httpRequest)

        expect(httpResponse.statusCode).toBe(500)
    })

    it('Should call UpdateTransactionUseCase with correct params', async () => {
        const { sut, useCase } = makSut()

        const executeSpy = import.meta.jest.spyOn(useCase, 'execute')

        await sut.execute(httpRequest)

        expect(executeSpy).toHaveBeenCalledWith(
            httpRequest.params.transactionId,
            httpRequest.body,
        )
    })

    it('Should return 404 if TransactionNotFoundError', async () => {
        const { sut, useCase } = makSut()

        import.meta.jest
            .spyOn(useCase, 'execute')
            .mockRejectedValueOnce(new TransactionNotFoundError(transaction.id))

        const result = await sut.execute(httpRequest)

        expect(result.statusCode).toBe(404)
    })
})

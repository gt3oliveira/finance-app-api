import { transaction } from '../../tests/index.js'
import { GetTransactionByUserIdController } from './get-transaction-by-user-id.js'
import { UserNotFoundError } from '../../errors/user.js'

/* eslint-disable no-undef */
describe('GetTransactionByUserIdController', () => {
    class GetTransactionByUserIdUseCaseStub {
        async execute() {
            return transaction
        }
    }

    const makSut = () => {
        const useCase = new GetTransactionByUserIdUseCaseStub()
        const sut = new GetTransactionByUserIdController(useCase)

        return {
            sut,
            useCase,
        }
    }

    const httpRequest = {
        query: {
            userId: transaction.user_id,
        },
    }

    it('Should return 200 on success', async () => {
        const { sut } = makSut()

        const httpResponse = await sut.execute(httpRequest)

        expect(httpResponse.statusCode).toBe(200)
    })

    it('Should return 400 on not exist param "userId"', async () => {
        const { sut } = makSut()

        const httpResponse = await sut.execute({
            query: {
                invalid_param: transaction.user_id,
            },
        })

        expect(httpResponse.statusCode).toBe(400)
    })

    it('Should return 400 on invalid user_id', async () => {
        const { sut } = makSut()

        const httpResponse = await sut.execute({
            query: {
                userId: 'invalid_user_id',
            },
        })

        expect(httpResponse.statusCode).toBe(400)
    })

    it('Should return 404 on UserNotFoundError in UseCase', async () => {
        const { sut, useCase } = makSut()

        import.meta.jest
            .spyOn(useCase, 'execute')
            .mockRejectedValueOnce(new UserNotFoundError())

        const httpResponse = await sut.execute(httpRequest)

        expect(httpResponse.statusCode).toBe(404)
    })

    it('Should return 500 on server error', async () => {
        const { sut, useCase } = makSut()

        import.meta.jest
            .spyOn(useCase, 'execute')
            .mockRejectedValueOnce(new Error())

        const httpResponse = await sut.execute(httpRequest)

        expect(httpResponse.statusCode).toBe(500)
    })

    it('Should call GetTransactionByUserIdUseCase with correct params', async () => {
        const { sut, useCase } = makSut()

        const executeSpy = import.meta.jest.spyOn(useCase, 'execute')

        await sut.execute(httpRequest)

        expect(executeSpy).toHaveBeenCalledWith(httpRequest.query.userId)
    })
})

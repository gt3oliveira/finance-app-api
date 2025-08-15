/* eslint-disable no-undef */
import { GetUserBalanceController } from './get-user-balance.js'
import { user } from '../../tests/index.js'
import { faker } from '@faker-js/faker'
import { UserNotFoundError } from '../../errors/user.js'

describe('GetUserBalanceController', () => {
    class getUserBalanceUseCaseStub {
        async execute() {
            return faker.finance.amount({
                min: 0,
                max: 1000,
            })
        }
    }

    const makSut = () => {
        const userBalanceUseCase = new getUserBalanceUseCaseStub()
        const sut = new GetUserBalanceController(userBalanceUseCase)

        return {
            sut,
            userBalanceUseCase,
        }
    }

    const httpRequest = {
        params: {
            userId: user.id,
        },
    }

    it('retorna 200 se o balanço for retornado', async () => {
        const { sut } = makSut()

        const httpResponse = await sut.execute(httpRequest)

        expect(httpResponse.statusCode).toBe(200)
    })

    it('retorna 400 se o id for invalido', async () => {
        const { sut } = makSut()

        const httpResponse = await sut.execute({
            params: {
                userId: 'invalid_id',
            },
        })

        expect(httpResponse.statusCode).toBe(400)
    })

    it('retorna 404 se der UserNotFoundError', async () => {
        const { sut, userBalanceUseCase } = makSut()

        jest.spyOn(userBalanceUseCase, 'execute').mockRejectedValueOnce(
            new UserNotFoundError(),
        )

        const httpResponse = await sut.execute(httpRequest)

        expect(httpResponse.statusCode).toBe(404)
    })

    it('retorna 500 se der server error', async () => {
        const { sut, userBalanceUseCase } = makSut()

        jest.spyOn(userBalanceUseCase, 'execute').mockRejectedValueOnce(
            new Error(),
        )

        const httpResponse = await sut.execute(httpRequest)

        expect(httpResponse.statusCode).toBe(500)
    })

    it('Should call UserBalanceUseCaseUseCase with correct params', async () => {
        const { sut, userBalanceUseCase } = makSut()

        const executeSpy = jest.spyOn(userBalanceUseCase, 'execute')

        await sut.execute(httpRequest)

        expect(executeSpy).toHaveBeenCalledWith(httpRequest.params.userId)
    })
})

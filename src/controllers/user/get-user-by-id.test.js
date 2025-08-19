import { user } from '../../tests/index.js'
import { GetUserByIdController } from './get-user-by-id.js'

describe('GetUserByIdController', () => {
    class getUserByIdUseCaseStub {
        async execute() {
            return user
        }
    }

    const makSut = () => {
        const userByIdUseCase = new getUserByIdUseCaseStub()
        const sut = new GetUserByIdController(userByIdUseCase)

        return {
            sut,
            userByIdUseCase,
        }
    }

    const httpRequest = {
        params: {
            userId: user.id,
        },
    }

    it('retorna 200 se o ususario for retornado', async () => {
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
        const { sut, userByIdUseCase } = makSut()

        import.meta.jest
            .spyOn(userByIdUseCase, 'execute')
            .mockResolvedValue(null)

        const httpResponse = await sut.execute(httpRequest)

        expect(httpResponse.statusCode).toBe(404)
    })

    it('retorna 500 se der server error', async () => {
        const { sut, userByIdUseCase } = makSut()

        import.meta.jest
            .spyOn(userByIdUseCase, 'execute')
            .mockRejectedValueOnce(new Error())

        const httpResponse = await sut.execute(httpRequest)

        expect(httpResponse.statusCode).toBe(500)
    })

    it('Should call UserByIdUseCaseUseCase with correct params', async () => {
        const { sut, userByIdUseCase } = makSut()

        const executeSpy = import.meta.jest.spyOn(userByIdUseCase, 'execute')

        await sut.execute(httpRequest)

        expect(executeSpy).toHaveBeenCalledWith(httpRequest.params.userId)
    })
})

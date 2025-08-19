import { UserNotFoundError } from '../../errors/user.js'
import { user } from '../../tests/index.js'
import { DeleteUserController } from './delete-user.js'

describe('DeleteUserController', () => {
    class DeleteUserUseCaseStub {
        async execute() {
            return user
        }
    }

    const makSut = () => {
        const deleteUserUseCase = new DeleteUserUseCaseStub()
        const sut = new DeleteUserController(deleteUserUseCase)

        return {
            sut,
            deleteUserUseCase,
        }
    }

    const httpRequest = {
        params: {
            userId: user.id,
        },
    }

    it('retorna 200 se o user for deletado', async () => {
        const { sut } = makSut()

        const result = await sut.execute(httpRequest)

        expect(result.statusCode).toBe(200)
    })

    it('retorna 400 se o id for invalido', async () => {
        const { sut } = makSut()

        const result = await sut.execute({
            params: {
                userId: 'invalid_id',
            },
        })

        expect(result.statusCode).toBe(400)
    })

    it('Should return 404 if user not found', async () => {
        const { sut, deleteUserUseCase } = makSut()

        import.meta.jest
            .spyOn(deleteUserUseCase, 'execute')
            .mockRejectedValueOnce(new UserNotFoundError())

        const result = await sut.execute(httpRequest)

        expect(result.statusCode).toBe(404)
    })

    it('Should return 500 on server error', async () => {
        const { sut, deleteUserUseCase } = makSut()

        import.meta.jest
            .spyOn(deleteUserUseCase, 'execute')
            .mockRejectedValueOnce(new Error())

        const result = await sut.execute(httpRequest)

        expect(result.statusCode).toBe(500)
    })

    it('Should call DeleteUserUseCase with correct params', async () => {
        const { sut, deleteUserUseCase } = makSut()

        const executeSpy = import.meta.jest.spyOn(deleteUserUseCase, 'execute')

        await sut.execute(httpRequest)

        expect(executeSpy).toHaveBeenCalledWith(httpRequest.params.userId)
    })
})

/* eslint-disable no-undef */
import { user } from '../../tests/index.js'
import { UpdateUserController } from './update-user.js'
import { EmailAlreadyInUseError, UserNotFoundError } from '../../errors/user.js'

describe('UpdateUserController', () => {
    class getUpdateUserCaseStub {
        async execute() {
            return user
        }
    }

    const makSut = () => {
        const updateUserUseCase = new getUpdateUserCaseStub()
        const sut = new UpdateUserController(updateUserUseCase)

        return {
            sut,
            updateUserUseCase,
        }
    }

    const httpRequest = {
        params: {
            userId: user.id,
        },
        body: {
            first_name: user.first_name,
            last_name: user.last_name,
            email: user.email,
            password: user.password,
        },
    }

    it('retorna 200 se o user for atualizado', async () => {
        const { sut } = makSut()

        const httpResponse = await sut.execute(httpRequest)

        expect(httpResponse.statusCode).toBe(200)
    })

    it('retorna 400 se o email for invalido', async () => {
        const { sut } = makSut()

        const httpResponse = await sut.execute({
            params: httpRequest.params,
            body: {
                ...httpRequest.body,
                email: 'invalid_email',
            },
        })

        expect(httpResponse.statusCode).toBe(400)
        expect(httpResponse.body).toEqual(
            expect.objectContaining({
                message: 'Invalid email format',
            }),
        )
    })

    it('retorna 400 se o password tiver menos que 6 caracteres', async () => {
        const { sut } = makSut()

        const httpResponse = await sut.execute({
            params: httpRequest.params,
            body: {
                ...httpRequest.body,
                password: '123',
            },
        })

        expect(httpResponse.statusCode).toBe(400)
        expect(httpResponse.body).toEqual(
            expect.objectContaining({
                message: 'Password must be at least 6 characters',
            }),
        )
    })

    it('retorna 400 se o id for invalido', async () => {
        const { sut } = makSut()

        const httpResponse = await sut.execute({
            params: {
                userId: 'invalid_id',
            },
            body: httpRequest.body,
        })

        expect(httpResponse.statusCode).toBe(400)
        expect(httpResponse.body).toEqual({
            message: 'The provided id is not valid.',
        })
    })

    it('retorna 400 se um campo não existente for informado', async () => {
        const { sut } = makSut()

        const httpResponse = await sut.execute({
            params: httpRequest.params,
            body: {
                ...httpRequest.body,
                unallowed_field: 'unallowed_field',
            },
        })

        expect(httpResponse.statusCode).toBe(400)
    })

    it('retorna 500 se getUpdateUserCase falhar', async () => {
        const { sut, updateUserUseCase } = makSut()

        import.meta.jest
            .spyOn(updateUserUseCase, 'execute')
            .mockRejectedValueOnce(new Error())

        const httpResponse = await sut.execute(httpRequest)

        expect(httpResponse.statusCode).toBe(500)
    })

    it('retorna 400 se o erro for EmailAlreadyInUseError', async () => {
        const { sut, updateUserUseCase } = makSut()

        import.meta.jest
            .spyOn(updateUserUseCase, 'execute')
            .mockRejectedValueOnce(new EmailAlreadyInUseError())

        const httpResponse = await sut.execute(httpRequest)

        expect(httpResponse.statusCode).toBe(400)
    })

    it('Should return 404 if user not found', async () => {
        const { sut, updateUserUseCase } = makSut()

        import.meta.jest
            .spyOn(updateUserUseCase, 'execute')
            .mockRejectedValueOnce(new UserNotFoundError(user.id))

        const result = await sut.execute(httpRequest)

        expect(result.statusCode).toBe(404)
    })

    it('Should call UpdateUserUseCase with correct params', async () => {
        const { sut, updateUserUseCase } = makSut()

        const executeSpy = import.meta.jest.spyOn(updateUserUseCase, 'execute')

        await sut.execute(httpRequest)

        expect(executeSpy).toHaveBeenCalledWith(
            httpRequest.params.userId,
            httpRequest.body,
        )
    })
})

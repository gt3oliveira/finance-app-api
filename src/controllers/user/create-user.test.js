/* eslint-disable no-undef */
import { EmailAlreadyInUseError } from '../../errors/user.js'
import { CreateUserController } from './create-user.js'
import { user } from '../../tests/index.js'

describe('CreateUserController', () => {
    class CreateUserUseCaseStub {
        async execute(user) {
            return user
        }
    }

    const makeSut = () => {
        const createUserUseCase = new CreateUserUseCaseStub()
        const createUserController = new CreateUserController(createUserUseCase)

        return { createUserUseCase, createUserController }
    }

    const httpRequest = {
        body: {
            first_name: user.first_name,
            last_name: user.last_name,
            email: user.email,
            password: user.password,
        },
    }

    it('retorna 201 se o user for criado', async () => {
        // arrange
        const { createUserController } = makeSut()

        // act
        const result = await createUserController.execute(httpRequest)

        // assert
        expect(result.statusCode).toBe(201)
        expect(result.body).toBe(httpRequest.body)
    })

    it('retorna 400 se o first_name não for informado', async () => {
        const { createUserController } = makeSut()

        const result = await createUserController.execute({
            body: {
                ...httpRequest.body,
                first_name: undefined,
            },
        })

        expect(result.statusCode).toBe(400)
    })

    it('retorna 400 se o last_name não for informado', async () => {
        const { createUserController } = makeSut()

        const result = await createUserController.execute({
            body: {
                ...httpRequest.body,
                last_name: undefined,
            },
        })

        expect(result.statusCode).toBe(400)
    })

    it('retorna 400 se o email não for informado', async () => {
        const { createUserController } = makeSut()

        const result = await createUserController.execute({
            body: {
                ...httpRequest.body,
                email: undefined,
            },
        })

        expect(result.statusCode).toBe(400)
    })

    it('retorna 400 se o email for inválido', async () => {
        const { createUserController } = makeSut()

        const result = await createUserController.execute({
            body: {
                ...httpRequest.body,
                email: 'invalid_email',
            },
        })

        expect(result.statusCode).toBe(400)
    })

    it('retorna 400 se o password não for informado', async () => {
        const { createUserController } = makeSut()

        const result = await createUserController.execute({
            body: {
                ...httpRequest.body,
                email: undefined,
            },
        })

        expect(result.statusCode).toBe(400)
    })

    it('retorna 400 se o password for menor que 6', async () => {
        const { createUserController } = makeSut()

        const result = await createUserController.execute({
            body: {
                ...httpRequest.body,
                password: 'pass',
            },
        })

        expect(result.statusCode).toBe(400)
    })

    it('observa se os params estão corretos para chamar o CreateUserUseCase', async () => {
        const { createUserController, createUserUseCase } = makeSut()
        const executeSpy = import.meta.jest.spyOn(createUserUseCase, 'execute')

        await createUserController.execute(httpRequest)

        expect(executeSpy).toHaveBeenCalledWith(httpRequest.body)
    })

    it('retorna 400 se o CreateUserUseCase falhar', async () => {
        const { createUserController, createUserUseCase } = makeSut()

        import.meta.jest
            .spyOn(createUserUseCase, 'execute')
            .mockImplementationOnce(() => {
                throw new Error()
            })

        const result = await createUserController.execute(httpRequest.body)

        expect(result.statusCode).toBe(400)
    })

    it('retorna 400 se o CreateUserUseCase der EmailAlreadyInUseError', async () => {
        const { createUserController, createUserUseCase } = makeSut()

        import.meta.jest
            .spyOn(createUserUseCase, 'execute')
            .mockRejectedValueOnce(new EmailAlreadyInUseError())

        const result = await createUserController.execute(httpRequest)

        expect(result.statusCode).toBe(400)
    })

    it('retorna 500 se der server error', async () => {
        const { createUserController, createUserUseCase } = makeSut()

        import.meta.jest
            .spyOn(createUserUseCase, 'execute')
            .mockRejectedValueOnce(new Error())

        const result = await createUserController.execute(httpRequest)

        expect(result.statusCode).toBe(500)
    })
})

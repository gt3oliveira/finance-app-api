import { InvalidPasswordError, UserNotFoundError } from '../../errors'
import { user } from '../../tests'
import { LoginUserController } from './login-user'

describe('LoginUserUseCase', () => {
    class LoginUserUseCaseStub {
        async execute() {
            return {
                ...user,
                tokens: {
                    accessToken: 'any_token-access',
                    refreshToken: 'any_token-refresh',
                },
            }
        }
    }

    const makeSut = () => {
        const loginUserUseCase = new LoginUserUseCaseStub()
        const sut = new LoginUserController(loginUserUseCase)

        return {
            sut,
            loginUserUseCase,
        }
    }

    const httpRequest = {
        body: {
            email: user.email,
            password: 'any_password',
        },
    }

    it('should return 200 on successful login', async () => {
        const { sut } = makeSut()

        const httpResponse = await sut.execute(httpRequest)

        expect(httpResponse.statusCode).toBe(200)
        expect(httpResponse.body.tokens.accessToken).toBe('any_token-access')
        expect(httpResponse.body.tokens.refreshToken).toBe('any_token-refresh')
    })

    it('should return 401 on login failure', async () => {
        const { sut, loginUserUseCase } = makeSut()
        import.meta.jest
            .spyOn(loginUserUseCase, 'execute')
            .mockImplementationOnce(() => {
                throw new InvalidPasswordError()
            })

        const httpResponse = await sut.execute(httpRequest)

        expect(httpResponse.statusCode).toBe(401)
    })

    it('should return 404 on user not found', async () => {
        const { sut, loginUserUseCase } = makeSut()
        import.meta.jest
            .spyOn(loginUserUseCase, 'execute')
            .mockImplementationOnce(() => {
                throw new UserNotFoundError()
            })

        const httpResponse = await sut.execute(httpRequest)

        expect(httpResponse.statusCode).toBe(404)
    })

    it('should return 500 on server error', async () => {
        const { sut, loginUserUseCase } = makeSut()
        import.meta.jest
            .spyOn(loginUserUseCase, 'execute')
            .mockRejectedValueOnce(new Error())

        const httpResponse = await sut.execute(httpRequest)

        expect(httpResponse.statusCode).toBe(500)
    })
})

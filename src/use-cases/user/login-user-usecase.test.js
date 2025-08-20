import { InvalidPasswordError, UserNotFoundError } from '../../errors'
import { user } from '../../tests/index.js'
import { LoginUserUseCase } from './login-user'

describe('LoginUserUseCase', () => {
    class getUserByEmailRepositoryStub {
        async execute() {
            return user
        }
    }

    class passwordComparatorAdapterStub {
        async execute() {
            return true
        }
    }

    class tokensGeneratorAdapterStub {
        execute() {
            return {
                accessToken: 'any_access_token',
                refreshToken: 'any_refresh_token',
            }
        }
    }

    const makeSut = () => {
        const getUserByEmailRepository = new getUserByEmailRepositoryStub()
        const passwordComparatorAdapter = new passwordComparatorAdapterStub()
        const tokensGeneratorAdapter = new tokensGeneratorAdapterStub()

        const sut = new LoginUserUseCase(
            getUserByEmailRepository,
            passwordComparatorAdapter,
            tokensGeneratorAdapter,
        )

        return {
            sut,
            getUserByEmailRepository,
            passwordComparatorAdapter,
            tokensGeneratorAdapter,
        }
    }

    it('should throw UserNotFoundError if user does not exist', async () => {
        const { sut, getUserByEmailRepository } = makeSut()
        import.meta.jest
            .spyOn(getUserByEmailRepository, 'execute')
            .mockResolvedValue(null)

        const promise = sut.execute('any_email', 'any_password')

        await expect(promise).rejects.toThrow(new UserNotFoundError())
    })

    it('should throw InvalidPasswordError if password is invalid', async () => {
        const { sut, passwordComparatorAdapter } = makeSut()
        import.meta.jest
            .spyOn(passwordComparatorAdapter, 'execute')
            .mockResolvedValue(false)

        const promise = sut.execute('any_email', 'any_password')

        await expect(promise).rejects.toThrow(new InvalidPasswordError())
    })

    it('should return user with tokens on success', async () => {
        const { sut } = makeSut()

        const response = await sut.execute('any_email', 'any_password')

        expect(response.tokens.accessToken).toBeDefined()
    })
})

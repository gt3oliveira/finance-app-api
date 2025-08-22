import { UnauthorizedError } from '../../errors'
import { RefreshTokenController } from './refresh-token'

describe('RefreshTokenController', () => {
    class refreshTokenUseCaseStub {
        execute() {
            return {
                accessToken: 'newAccessToken',
                refreshToken: 'newRefreshToken',
            }
        }
    }

    const makeSut = () => {
        const refreshTokenUseCase = new refreshTokenUseCaseStub()
        const sut = new RefreshTokenController(refreshTokenUseCase)

        return {
            sut,
            refreshTokenUseCase,
        }
    }

    it('should return 400 if refreshToken is not provided', async () => {
        const { sut } = makeSut()
        const httpRequest = {
            body: {
                refreshToken: 2,
            },
        }

        const httpResponse = await sut.execute(httpRequest)

        expect(httpResponse.statusCode).toBe(400)
    })

    it('should return 200 if refreshToken is provided', async () => {
        const { sut } = makeSut()
        const httpRequest = {
            body: {
                refreshToken: 'any_token',
            },
        }

        const httpResponse = await sut.execute(httpRequest)

        expect(httpResponse.statusCode).toBe(200)
        expect(httpResponse.body).toEqual({
            accessToken: 'newAccessToken',
            refreshToken: 'newRefreshToken',
        })
    })

    it('should return 401 is use case throws UnauthorizedError', async () => {
        const { sut, refreshTokenUseCase } = makeSut()
        import.meta.jest
            .spyOn(refreshTokenUseCase, 'execute')
            .mockImplementationOnce(() => {
                throw new UnauthorizedError()
            })
        const httpRequest = {
            body: {
                refreshToken: '1',
            },
        }

        const httpResponse = await sut.execute(httpRequest)

        expect(httpResponse.statusCode).toBe(401)
    })

    it('should return 500 if refreshTokenUseCase throws', async () => {
        const { sut, refreshTokenUseCase } = makeSut()
        import.meta.jest
            .spyOn(refreshTokenUseCase, 'execute')
            .mockImplementationOnce(() => {
                throw new Error()
            })
        const httpRequest = {
            body: {
                refreshToken: 'any_token',
            },
        }

        const httpResponse = await sut.execute(httpRequest)

        expect(httpResponse.statusCode).toBe(500)
    })
})

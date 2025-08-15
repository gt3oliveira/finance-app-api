import { UserNotFoundError } from '../../errors/user.js'
import { user, userBalance } from '../../tests/index.js'
import { GetUserBalanceUseCase } from './get-user-balance.js'

/* eslint-disable no-undef */
describe('GetUserBalanceUseCase', () => {
    class getUserBalanceRepositoryStub {
        async execute() {
            return userBalance
        }
    }

    class getUserByIdRepositoryStub {
        async execute() {
            return user
        }
    }

    const makSut = () => {
        const getUserBalanceRepository = new getUserBalanceRepositoryStub()
        const getUserByIdRepository = new getUserByIdRepositoryStub()

        const sut = new GetUserBalanceUseCase(
            getUserBalanceRepository,
            getUserByIdRepository,
        )

        return {
            sut,
            getUserBalanceRepository,
            getUserByIdRepository,
        }
    }

    it('should get user balance on successfully', async () => {
        const { sut } = makSut()

        const result = await sut.execute(user.id)

        expect(result).toEqual(userBalance)
    })

    it('should throw if getUserByIdRepository throws null', async () => {
        const { sut, getUserByIdRepository } = makSut()

        jest.spyOn(getUserByIdRepository, 'execute').mockResolvedValueOnce(null)

        const promise = sut.execute(user.id)

        await expect(promise).rejects.toThrow(new UserNotFoundError(user.id))
    })

    it('should throw if getUserByIdRepository throws Error', async () => {
        const { sut, getUserByIdRepository } = makSut()

        jest.spyOn(getUserByIdRepository, 'execute').mockRejectedValueOnce(
            new Error(),
        )

        const promise = sut.execute(user.id)

        await expect(promise).rejects.toThrow(new Error())
    })

    it('should throw if getUserBalanceRepository throws Error', async () => {
        const { sut, getUserBalanceRepository } = makSut()

        jest.spyOn(getUserBalanceRepository, 'execute').mockRejectedValueOnce(
            new Error(),
        )

        const promise = sut.execute(user.id)

        await expect(promise).rejects.toThrow(new Error())
    })

    it('should call GetUserBalanceRepository with correct params', async () => {
        const { sut, getUserBalanceRepository } = makSut()

        const executeSpy = jest.spyOn(getUserBalanceRepository, 'execute')

        await sut.execute(user.id)

        expect(executeSpy).toHaveBeenCalledWith(user.id)
    })

    it('should call getUserByIdRepository with correct params', async () => {
        const { sut, getUserByIdRepository } = makSut()

        const executeSpy = jest.spyOn(getUserByIdRepository, 'execute')

        await sut.execute(user.id)

        expect(executeSpy).toHaveBeenCalledWith(user.id)
    })
})

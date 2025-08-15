/* eslint-disable no-undef */
import { GetTransactionByUserIdUseCase } from './get-transaction-by-user-id.js'
import { transaction, user } from '../../tests/index.js'
import { UserNotFoundError } from '../../errors/user.js'

describe('GetTransactionByUserIdUseCase', () => {
    class GetTransactionByUserIdRepositoryStub {
        async execute(userId) {
            return { ...transaction, userId }
            // return []
        }
    }

    class GetUserByIdRepositoryStub {
        async execute(userId) {
            return { ...user, id: userId }
        }
    }

    const makeSuit = () => {
        const getTransactionByUserIdRepository =
            new GetTransactionByUserIdRepositoryStub()
        const getUserByIdRepository = new GetUserByIdRepositoryStub()

        const sut = new GetTransactionByUserIdUseCase(
            getTransactionByUserIdRepository,
            getUserByIdRepository,
        )

        return {
            sut,
            getTransactionByUserIdRepository,
            getUserByIdRepository,
        }
    }

    it('should if get transaction by user id on successfully', async () => {
        const { sut } = makeSuit()

        const transactions = await sut.execute(user.id)

        expect(transactions).toEqual({ ...transaction, userId: user.id })
        // expect(transactions).toEqual([])
    })

    it('should call getByUserIdRepository with correct params', async () => {
        const { sut, getUserByIdRepository } = makeSuit()

        const executeSpy = jest.spyOn(getUserByIdRepository, 'execute')

        await sut.execute(user.id)

        expect(executeSpy).toHaveBeenCalledWith(user.id)
    })

    it('should call getTransactionByUserIdRepository with correct params', async () => {
        const { sut, getTransactionByUserIdRepository } = makeSuit()

        const executeSpy = jest.spyOn(
            getTransactionByUserIdRepository,
            'execute',
        )

        await sut.execute(user.id)

        expect(executeSpy).toHaveBeenCalledWith(user.id)
    })

    it('should throw UserNotFoundError if user not found', async () => {
        const { sut, getUserByIdRepository } = makeSuit()

        jest.spyOn(getUserByIdRepository, 'execute').mockResolvedValueOnce(null)

        const promise = sut.execute(user.id)

        await expect(promise).rejects.toThrow(new UserNotFoundError(user.id))
    })

    it('should throw getUserByIdRepository throws', async () => {
        const { sut, getUserByIdRepository } = makeSuit()

        jest.spyOn(getUserByIdRepository, 'execute').mockRejectedValueOnce(
            new Error(),
        )

        const promise = sut.execute(user.id)

        await expect(promise).rejects.toThrow(new Error())
    })

    it('should throw getTransactionByUserIdRepository throws', async () => {
        const { sut, getTransactionByUserIdRepository } = makeSuit()

        jest.spyOn(
            getTransactionByUserIdRepository,
            'execute',
        ).mockRejectedValueOnce(new Error())

        const promise = sut.execute(user.id)

        await expect(promise).rejects.toThrow(new Error())
    })
})

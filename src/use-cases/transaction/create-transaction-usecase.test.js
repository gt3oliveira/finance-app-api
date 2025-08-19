import { UserNotFoundError } from '../../errors/user.js'
import { transaction, user } from '../../tests/index.js'
import { CreateTransactionUseCase } from './create-transaction.js'

describe('UpdateUserUseCase', () => {
    class createTransactionRepositoryStub {
        async execute() {
            return {
                ...transaction,
                id: 'generated-id',
            }
        }
    }
    class getUserByIdRepositoryStub {
        async execute(userId) {
            return { ...user, id: userId }
        }
    }
    class idGeneratorAdapterStub {
        execute() {
            return 'generated-id'
        }
    }

    const makeSut = () => {
        const createTransactionRepository =
            new createTransactionRepositoryStub()
        const getUserByIdRepository = new getUserByIdRepositoryStub()
        const idGeneratorAdapter = new idGeneratorAdapterStub()

        const sut = new CreateTransactionUseCase(
            createTransactionRepository,
            getUserByIdRepository,
            idGeneratorAdapter,
        )

        return {
            sut,
            createTransactionRepository,
            getUserByIdRepository,
            idGeneratorAdapter,
        }
    }

    it('should create Transaction on successfully', async () => {
        const { sut } = makeSut()

        const result = await sut.execute(transaction)

        expect(result).toEqual({
            ...transaction,
            id: 'generated-id',
        })
    })

    it('should call getUserByIdRepository with correct params', async () => {
        const { sut, getUserByIdRepository } = makeSut()

        const executeSpy = import.meta.jest.spyOn(
            getUserByIdRepository,
            'execute',
        )

        await sut.execute(transaction)

        expect(executeSpy).toHaveBeenCalledWith(transaction.user_id)
    })

    it('should call idGeneratorAdapter with correct params', async () => {
        const { sut, idGeneratorAdapter } = makeSut()

        const executeSpy = import.meta.jest.spyOn(idGeneratorAdapter, 'execute')

        await sut.execute(transaction)

        expect(executeSpy).toHaveBeenCalled()
    })

    it('should call createTransactionRepository with correct params', async () => {
        const { sut, createTransactionRepository } = makeSut()

        const executeSpy = import.meta.jest.spyOn(
            createTransactionRepository,
            'execute',
        )

        await sut.execute(transaction)

        expect(executeSpy).toHaveBeenCalledWith({
            ...transaction,
            id: 'generated-id',
        })
    })

    it('should throw if getUserByIdRepository if user not found', async () => {
        const { sut, getUserByIdRepository } = makeSut()

        import.meta.jest
            .spyOn(getUserByIdRepository, 'execute')
            .mockRejectedValueOnce(new UserNotFoundError(transaction.user_id))

        const promise = sut.execute(transaction)

        await expect(promise).rejects.toThrow(
            new UserNotFoundError(transaction.user_id),
        )
    })

    it('should throw if getUserByIdRepository throws', async () => {
        const { sut, getUserByIdRepository } = makeSut()

        import.meta.jest
            .spyOn(getUserByIdRepository, 'execute')
            .mockRejectedValueOnce(new Error())

        const promise = sut.execute(transaction)

        await expect(promise).rejects.toThrow(new Error())
    })

    it('should throw if idGeneratorAdapter throws', async () => {
        const { sut, idGeneratorAdapter } = makeSut()

        import.meta.jest
            .spyOn(idGeneratorAdapter, 'execute')
            .mockImplementationOnce(() => {
                throw new Error()
            })

        const promise = sut.execute(transaction)

        await expect(promise).rejects.toThrow(new Error())
    })

    it('should throw if createTransactionRepository throws', async () => {
        const { sut, createTransactionRepository } = makeSut()

        import.meta.jest
            .spyOn(createTransactionRepository, 'execute')
            .mockRejectedValueOnce(new Error())

        const promise = sut.execute(transaction)

        await expect(promise).rejects.toThrow(new Error())
    })
})

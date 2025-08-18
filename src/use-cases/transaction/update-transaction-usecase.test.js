/* eslint-disable no-undef */
import { transaction } from '../../tests/index.js'
import { UpdateTransactionUseCase } from './update-transaction.js'

describe('UpdateTransactionUseCase', () => {
    class updateTransactionRepositoryStub {
        async execute(transactionId) {
            return { transactionId: transactionId, ...transaction }
        }
    }

    const makeSut = () => {
        const updateTransactionRepository =
            new updateTransactionRepositoryStub()
        const sut = new UpdateTransactionUseCase(updateTransactionRepository)

        return {
            sut,
            updateTransactionRepository,
        }
    }

    it('Should if update transaction on successfully', async () => {
        const { sut } = makeSut()

        const result = await sut.execute(transaction.id, transaction.name)

        expect(result).toEqual({
            transactionId: transaction.id,
            ...transaction,
        })
    })

    it('Should call updateTransactionRepository with correct params', async () => {
        const { sut, updateTransactionRepository } = makeSut()

        const executeSpy = import.meta.jest.spyOn(
            updateTransactionRepository,
            'execute',
        )

        await sut.execute(transaction.id, transaction.name)

        expect(executeSpy).toHaveBeenCalledWith(
            transaction.id,
            transaction.name,
        )
    })

    it('Should throw if updateTransactionRepository throws', async () => {
        const { sut, updateTransactionRepository } = makeSut()

        import.meta.jest
            .spyOn(updateTransactionRepository, 'execute')
            .mockRejectedValueOnce(new Error())

        const promise = sut.execute(transaction.id, transaction.name)

        await expect(promise).rejects.toThrow(new Error())
    })
})

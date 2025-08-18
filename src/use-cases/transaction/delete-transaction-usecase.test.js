/* eslint-disable no-undef */
import { transaction } from '../../tests/index.js'
import { DeleteTransactionUseCase } from './delete-transaction.js'

describe('DeleteTransactionUseCase', () => {
    class deleteTransactionRepositoryStub {
        async execute(transactionId) {
            return { ...transaction, id: transactionId }
        }
    }

    const makeSut = () => {
        const deleteTransactionRepository =
            new deleteTransactionRepositoryStub()

        const sut = new DeleteTransactionUseCase(deleteTransactionRepository)
        return {
            sut,
            deleteTransactionRepository,
        }
    }

    it('should if deleted transaction on successfully', async () => {
        const { sut } = makeSut()

        const deletedTransaction = await sut.execute(transaction.id)

        expect(deletedTransaction).toEqual({
            ...transaction,
            id: transaction.id,
        })
    })

    it('should call deleteTransactionRepository with correct params', async () => {
        const { sut, deleteTransactionRepository } = makeSut()

        const executeSpy = import.meta.jest.spyOn(
            deleteTransactionRepository,
            'execute',
        )

        await sut.execute(transaction.id)

        expect(executeSpy).toHaveBeenCalledWith(transaction.id)
    })

    it('should throw if deleteTransactionRepository throws', async () => {
        const { sut, deleteTransactionRepository } = makeSut()

        import.meta.jest
            .spyOn(deleteTransactionRepository, 'execute')
            .mockRejectedValueOnce(new Error())

        const promise = sut.execute(transaction.id)

        await expect(promise).rejects.toThrow(new Error())
    })
})

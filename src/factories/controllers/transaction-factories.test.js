import {
    CreateTransactionController,
    DeleteTransactionController,
    GetTransactionByUserIdController,
    UpdateTransactionController,
} from '../../controllers'
import {
    makeCreateTransactionController,
    makeDeleteTransactionController,
    makeGetTransactionByUserIdController,
    makeUpdateTransactionController,
} from './transaction'

/* eslint-disable no-undef */
describe('Transaction Controller Factories', () => {
    it('should return a CreateTransactionController', () => {
        expect(makeCreateTransactionController()).toBeInstanceOf(
            CreateTransactionController,
        )
    })

    it('should return a makeGetTransactionByUserIdController', () => {
        expect(makeGetTransactionByUserIdController()).toBeInstanceOf(
            GetTransactionByUserIdController,
        )
    })

    it('should return a makeUpdateTransactionController', () => {
        expect(makeUpdateTransactionController()).toBeInstanceOf(
            UpdateTransactionController,
        )
    })

    it('should return a makeDeleteTransactionController', () => {
        expect(makeDeleteTransactionController()).toBeInstanceOf(
            DeleteTransactionController,
        )
    })
})

import { Router } from 'express'
import {
    makeCreateTransactionController,
    makeDeleteTransactionController,
    makeGetTransactionByUserIdController,
    makeUpdateTransactionController,
} from '../factories/controllers/transaction.js'

export const transactionRouter = Router()

// Get transactions by user ID
transactionRouter.get('/', async (req, res) => {
    const getTransactionByUserIdController =
        makeGetTransactionByUserIdController()

    const { statusCode, body } = await getTransactionByUserIdController.execute(
        req,
        res,
    )

    res.status(statusCode).send(body)
})

// Create a transaction
transactionRouter.post('/', async (req, res) => {
    const createTransactionController = makeCreateTransactionController()

    const { statusCode, body } = await createTransactionController.execute(
        req,
        res,
    )

    res.status(statusCode).send(body)
})

transactionRouter.patch('/:transactionId', async (req, res) => {
    const updateTransactionController = makeUpdateTransactionController()

    const { statusCode, body } = await updateTransactionController.execute(req)

    res.status(statusCode).send(body)
})

transactionRouter.delete('/:transactionId', async (req, res) => {
    const deleteTransactionController = makeDeleteTransactionController()

    const { statusCode, body } = await deleteTransactionController.execute(
        req,
        res,
    )

    res.status(statusCode).send(body)
})

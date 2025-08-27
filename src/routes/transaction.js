import { Router } from 'express'
import {
    makeCreateTransactionController,
    makeDeleteTransactionController,
    makeGetTransactionByUserIdController,
    makeUpdateTransactionController,
} from '../factories/controllers/transaction.js'
import { auth } from '../middlewares/auth.js'

export const transactionRouter = Router()

// Get transactions by user ID
transactionRouter.get('/me', auth, async (req, res) => {
    const getTransactionByUserIdController =
        makeGetTransactionByUserIdController()

    const { statusCode, body } = await getTransactionByUserIdController.execute(
        {
            ...req,
            query: {
                ...req.query,
                from: req.query.from,
                to: req.query.to,
                userId: req.userId,
            },
        },
    )

    res.status(statusCode).send(body)
})

// Create a transaction
transactionRouter.post('/me', auth, async (req, res) => {
    const createTransactionController = makeCreateTransactionController()

    const { statusCode, body } = await createTransactionController.execute({
        ...req,
        body: {
            ...req.body,
            user_id: req.userId,
        },
    })

    res.status(statusCode).send(body)
})

transactionRouter.patch('/me/:transactionId', auth, async (req, res) => {
    const updateTransactionController = makeUpdateTransactionController()

    const { statusCode, body } = await updateTransactionController.execute({
        ...req,
        body: {
            ...req.body,
            user_id: req.user_id,
        },
    })

    res.status(statusCode).send(body)
})

transactionRouter.delete('/me/:transactionId', auth, async (req, res) => {
    const deleteTransactionController = makeDeleteTransactionController()

    const { statusCode, body } = await deleteTransactionController.execute({
        params: {
            transactionId: req.params.transactionId,
            user_id: req.user_id,
        },
    })

    res.status(statusCode).send(body)
})

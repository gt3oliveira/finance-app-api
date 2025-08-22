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
transactionRouter.get('/', auth, async (req, res) => {
    const getTransactionByUserIdController =
        makeGetTransactionByUserIdController()

    const { statusCode, body } = await getTransactionByUserIdController.execute(
        {
            ...req,
            query: {
                ...req.query,
                userId: req.userId,
            },
        },
    )

    res.status(statusCode).send(body)
})

// Create a transaction
transactionRouter.post('/', auth, async (req, res) => {
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

transactionRouter.patch('/:transactionId', auth, async (req, res) => {
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

transactionRouter.delete('/:transactionId', async (req, res) => {
    const deleteTransactionController = makeDeleteTransactionController()

    const { statusCode, body } = await deleteTransactionController.execute(
        req,
        res,
    )

    res.status(statusCode).send(body)
})

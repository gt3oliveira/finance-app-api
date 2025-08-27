import { Router } from 'express'
import {
    makeCreateUserController,
    makeDeleteUserController,
    makeGetUserBalanceController,
    makeGetUserByIdController,
    makeLoginUserController,
    makeRefreshTokenController,
    makeUpdateUserController,
} from '../factories/controllers/user.js'
import { auth } from '../middlewares/auth.js'

export const userRouter = Router()

// Get a user by ID
userRouter.get('/', auth, async (req, res) => {
    const getUserByIdController = makeGetUserByIdController()

    const { statusCode, body } = await getUserByIdController.execute({
        ...req,
        params: {
            userId: req.userId,
        },
    })

    res.status(statusCode).send(body)
})

userRouter.get('/balance', auth, async (req, res) => {
    const getUserBalanceController = makeGetUserBalanceController()

    const { statusCode, body } = await getUserBalanceController.execute({
        ...req,
        params: {
            userId: req.userId,
        },
        query: {
            from: req.query.from,
            to: req.query.to,
        },
    })

    res.status(statusCode).send(body)
})

// Create a new user
userRouter.post('/', async (req, res) => {
    const createUserController = makeCreateUserController()

    const { statusCode, body } = await createUserController.execute(req)

    res.status(statusCode).send(body)
})

// Update a user
userRouter.patch('/', auth, async (req, res) => {
    const updateUserController = makeUpdateUserController()

    const { statusCode, body } = await updateUserController.execute({
        ...req,
        params: {
            userId: req.userId,
        },
    })

    res.status(statusCode).send(body)
})

// Delete a user
userRouter.delete('/', auth, async (req, res) => {
    const deleteUserController = makeDeleteUserController()

    const { statusCode, body } = await deleteUserController.execute({
        ...req,
        params: {
            userId: req.userId,
        },
    })

    res.status(statusCode).send(body)
})

userRouter.post('/login', async (req, res) => {
    const loginUserController = makeLoginUserController()

    const { statusCode, body } = await loginUserController.execute(req)

    res.status(statusCode).send(body)
})

userRouter.post('/refresh-token', async (req, res) => {
    const refreshTokenController = makeRefreshTokenController()

    const { statusCode, body } = await refreshTokenController.execute(req)

    res.status(statusCode).send(body)
})

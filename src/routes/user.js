import { Router } from 'express'
import {
    makeCreateUserController,
    makeDeleteUserController,
    makeGetUserBalanceController,
    makeGetUserByIdController,
    makeLoginUserController,
    makeUpdateUserController,
} from '../factories/controllers/user.js'
import { auth } from '../middlewares/auth.js'

export const userRouter = Router()

// Get a user by ID
userRouter.get('/:userId', auth, async (req, res) => {
    const getUserByIdController = makeGetUserByIdController()
    // console.log('Usuario autenticado:', req.userId)
    const { statusCode, body } = await getUserByIdController.execute(req)

    res.status(statusCode).send(body)
})

userRouter.get('/:userId/balance', auth, async (req, res) => {
    const getUserBalanceController = makeGetUserBalanceController()

    const { statusCode, body } = await getUserBalanceController.execute(req)

    res.status(statusCode).send(body)
})

// Create a new user
userRouter.post('/', async (req, res) => {
    const createUserController = makeCreateUserController()

    const { statusCode, body } = await createUserController.execute(req)

    res.status(statusCode).send(body)
})

// Update a user
userRouter.patch('/:userId', auth, async (req, res) => {
    const updateUserController = makeUpdateUserController()

    const { statusCode, body } = await updateUserController.execute(req)

    res.status(statusCode).send(body)
})

// Delete a user
userRouter.delete('/:userId', auth, async (req, res) => {
    const deleteUserController = makeDeleteUserController()

    const { statusCode, body } = await deleteUserController.execute(req)

    res.status(statusCode).send(body)
})

userRouter.post('/login', async (req, res) => {
    const loginUserController = makeLoginUserController()

    const { statusCode, body } = await loginUserController.execute(req)

    res.status(statusCode).send(body)
})

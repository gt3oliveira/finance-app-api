import { ZodError } from 'zod'
import { updateUserSchema } from '../../schemas/user.js'
import {
    ok,
    checkIfIdIsValid,
    invalidIdResponse,
    serverError,
    badRequest,
    userNotFoundResponse,
} from '../helpers/index.js'
import { EmailAlreadyInUseError, UserNotFoundError } from '../../errors/user.js'

export class UpdateUserController {
    constructor(updateUserUseCase) {
        this.updateUserUseCase = updateUserUseCase
    }

    async execute(httpRequest) {
        try {
            const idIsValid = checkIfIdIsValid(httpRequest.params.userId)

            if (!idIsValid) {
                return invalidIdResponse()
            }

            const params = httpRequest.body

            await updateUserSchema.parseAsync(params)

            const updatedUser = await this.updateUserUseCase.execute(
                httpRequest.params.userId,
                params,
            )

            return ok(updatedUser)
        } catch (error) {
            console.error('<< Error in UpdateUserController >>:', error)

            if (error instanceof ZodError) {
                return badRequest({
                    message: error.issues[0].message,
                })
            }

            if (error instanceof EmailAlreadyInUseError) {
                return badRequest({ message: error.message })
            }

            if (error instanceof UserNotFoundError) {
                return userNotFoundResponse()
            }

            return serverError()
        }
    }
}

import {
    badRequest,
    ok,
    serverError,
    unauthorized,
    userNotFoundResponse,
} from '../helpers/index.js'
import { UserNotFoundError, InvalidPasswordError } from '../../errors/index.js'
import { loginUserSchema } from '../../schemas/index.js'
import { ZodError } from 'zod'

export class LoginUserController {
    constructor(loginUserUseCase) {
        this.loginUserUseCase = loginUserUseCase
    }

    async execute(httpRequest) {
        try {
            const params = httpRequest.body
            await loginUserSchema.parseAsync(params)

            const user = await this.loginUserUseCase.execute(
                params.email,
                params.password,
            )

            return ok(user)
        } catch (error) {
            console.error('<< Error in LoginUserController >>:', error)

            if (error instanceof ZodError) {
                return badRequest({
                    message: error.issues[0].message,
                })
            }

            if (error instanceof UserNotFoundError) {
                return userNotFoundResponse()
            }

            if (error instanceof InvalidPasswordError) {
                return unauthorized()
            }

            return serverError()
        }
    }
}

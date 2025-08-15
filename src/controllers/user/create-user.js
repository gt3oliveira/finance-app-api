import { ZodError } from 'zod'
import { createUserSchema } from '../../schemas/index.js'
import { badRequest, created, serverError } from '../helpers/index.js'
import { EmailAlreadyInUseError } from '../../errors/user.js'

export class CreateUserController {
    constructor(createUserUseCase) {
        this.createUserUseCase = createUserUseCase
    }

    async execute(httpRequest) {
        try {
            const params = httpRequest.body

            await createUserSchema.parseAsync(params)

            const createdUser = await this.createUserUseCase.execute(params)

            return created(createdUser)
        } catch (error) {
            console.log('<< Error in CreateUserController >>:', error)

            if (error instanceof ZodError) {
                return badRequest({
                    message: error.issues[0].message,
                })
            }

            if (error instanceof EmailAlreadyInUseError) {
                return badRequest({ message: error.message })
            }

            return serverError()
        }
    }
}

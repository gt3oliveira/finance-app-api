import { EmailAlreadyInUseError } from '../../errors/user.js'

export class CreateUserUseCase {
    constructor(
        getUserByEmailRepository,
        createUserRepository,
        passwordHasherAdapter,
        idGeneratorAdapter,
        tokenGeneratorAdapter,
    ) {
        this.getUserByEmailRepository = getUserByEmailRepository
        this.createUserRepository = createUserRepository
        this.passwordHasherAdapter = passwordHasherAdapter
        this.idGeneratorAdapter = idGeneratorAdapter
        this.tokenGeneratorAdapter = tokenGeneratorAdapter
    }

    async execute(createUserParams) {
        const existingEmailUser = await this.getUserByEmailRepository.execute(
            createUserParams.email,
        )

        if (existingEmailUser) {
            throw new EmailAlreadyInUseError(createUserParams.email)
        }

        const userId = this.idGeneratorAdapter.execute()

        const hashedPassword = await this.passwordHasherAdapter.execute(
            createUserParams.password,
        )

        const user = {
            ...createUserParams,
            id: userId,
            password: hashedPassword,
        }

        const createUser = await this.createUserRepository.execute(user)

        return {
            ...createUser,
            tokens: this.tokenGeneratorAdapter.execute(userId),
        }
    }
}

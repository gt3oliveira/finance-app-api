import {
    PasswordHasherAdapter,
    IdGeneratorAdapter,
    TokensGeneratorAdapter,
} from '../../adapters/index.js'
import {
    CreateUserController,
    DeleteUserController,
    GetUserBalanceController,
    GetUserByIdController,
    LoginUserController,
    UpdateUserController,
} from '../../controllers/index.js'
import {
    PostgresCreateUserRepository,
    PostgresDeleteUserRepository,
    PostgresGetUserBalanceRepository,
    PostgresGetUserByEmailRepository,
    PostgresGetUserByIdRepository,
    PostgresUpdateUserRepository,
} from '../../repositories/postgres/index.js'
import {
    GetUserByIdUseCase,
    CreateUserUseCase,
    UpdateUserUseCase,
    DeleteUserUseCase,
    GetUserBalanceUseCase,
    LoginUserUseCase,
} from '../../use-cases/index.js'

export const makeGetUserByIdController = () => {
    const GetUserByIdRepository = new PostgresGetUserByIdRepository()
    const getUserByIdUseCase = new GetUserByIdUseCase(GetUserByIdRepository)

    return new GetUserByIdController(getUserByIdUseCase)
}

export const makeCreateUserController = () => {
    const createUserUseCase = new CreateUserUseCase(
        new PostgresGetUserByEmailRepository(),
        new PostgresCreateUserRepository(),
        new PasswordHasherAdapter(),
        new IdGeneratorAdapter(),
    )

    return new CreateUserController(createUserUseCase)
}

export const makeUpdateUserController = () => {
    const updateUserUseCase = new UpdateUserUseCase(
        new PostgresGetUserByEmailRepository(),
        new PostgresUpdateUserRepository(),
        new PasswordHasherAdapter(),
    )

    return new UpdateUserController(updateUserUseCase)
}

export const makeDeleteUserController = () => {
    const deleteUserRepository = new PostgresDeleteUserRepository()
    const deleteUserUseCase = new DeleteUserUseCase(deleteUserRepository)

    return new DeleteUserController(deleteUserUseCase)
}

export const makeGetUserBalanceController = () => {
    const getUserBalanceUseCase = new GetUserBalanceUseCase(
        new PostgresGetUserBalanceRepository(),
        new PostgresGetUserByIdRepository(),
    )

    return new GetUserBalanceController(getUserBalanceUseCase)
}

export const makeLoginUserController = () => {
    const loginUserUseCase = new LoginUserUseCase(
        new PostgresGetUserByEmailRepository(),
        new PasswordHasherAdapter(),
        new TokensGeneratorAdapter(),
    )

    return new LoginUserController(loginUserUseCase)
}

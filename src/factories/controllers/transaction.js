import { IdGeneratorAdapter } from '../../adapters/index.js'
import {
    CreateTransactionController,
    DeleteTransactionController,
    GetTransactionByUserIdController,
    UpdateTransactionController,
} from '../../controllers/index.js'
import {
    PostgresCreateTransactionRepository,
    PostgresDeleteTransactionRepository,
    PostgresGetTransactionByUserIdRepository,
    PostgresGetUserByIdRepository,
    PostgresUpdateTransactionRepository,
    PostgresGetTransactionByIdRepository,
} from '../../repositories/postgres/index.js'
import {
    CreateTransactionUseCase,
    DeleteTransactionUseCase,
    GetTransactionByUserIdUseCase,
    UpdateTransactionUseCase,
} from '../../use-cases/index.js'

export const makeCreateTransactionController = () => {
    const createTransactionUseCase = new CreateTransactionUseCase(
        new PostgresCreateTransactionRepository(),
        new PostgresGetUserByIdRepository(),
        new IdGeneratorAdapter(),
    )

    return new CreateTransactionController(createTransactionUseCase)
}

export const makeGetTransactionByUserIdController = () => {
    const getTransactionByUserIdUseCase = new GetTransactionByUserIdUseCase(
        new PostgresGetTransactionByUserIdRepository(),
        new PostgresGetUserByIdRepository(),
    )

    return new GetTransactionByUserIdController(getTransactionByUserIdUseCase)
}

export const makeUpdateTransactionController = () => {
    const updateTransactionUseCase = new UpdateTransactionUseCase(
        new PostgresUpdateTransactionRepository(),
        new PostgresGetTransactionByIdRepository(),
    )

    return new UpdateTransactionController(updateTransactionUseCase)
}

export const makeDeleteTransactionController = () => {
    const deleteTransactionUseCase = new DeleteTransactionUseCase(
        new PostgresDeleteTransactionRepository(),
    )

    return new DeleteTransactionController(deleteTransactionUseCase)
}

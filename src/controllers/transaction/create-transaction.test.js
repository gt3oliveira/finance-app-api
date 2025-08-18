import { CreateTransactionController } from './create-transaction.js'
import { UserNotFoundError } from '../../errors/user.js'
import { transaction } from '../../tests/index.js'

/* eslint-disable no-undef */
describe('CreateTransactionController', () => {
    class createTransactionUseCaseStub {
        async execute() {
            return transaction
        }
    }

    const makSut = () => {
        const createTransactionUseCase = new createTransactionUseCaseStub()
        const sut = new CreateTransactionController(createTransactionUseCase)

        return {
            sut,
            createTransactionUseCase,
        }
    }

    const httpRequest = {
        body: {
            user_id: transaction.user_id,
            name: transaction.name,
            date: transaction.date,
            type: transaction.type,
            amount: transaction.amount,
        },
    }

    it('retorna 200 se a transação for criada', async () => {
        const { sut } = makSut()

        const httpResponse = await sut.execute(httpRequest)

        expect(httpResponse.statusCode).toBe(200)
    })

    it('retorna 200 se type for "EARNING"', async () => {
        const { sut } = makSut()

        const httpResponse = await sut.execute({
            body: {
                ...httpRequest.body,
                type: 'EARNING',
            },
        })

        expect(httpResponse.statusCode).toBe(200)
    })

    it('retorna 200 se type for "INVESTMENT"', async () => {
        const { sut } = makSut()

        const httpResponse = await sut.execute({
            body: {
                ...httpRequest.body,
                type: 'INVESTMENT',
            },
        })

        expect(httpResponse.statusCode).toBe(200)
    })

    it('retorna 400 se user_id for underfined', async () => {
        const { sut } = makSut()

        const httpResponse = await sut.execute({
            body: {
                ...httpRequest.body,
                user_id: undefined,
            },
        })

        expect(httpResponse.statusCode).toBe(400)
    })

    it('retorna 400 se name for underfined', async () => {
        const { sut } = makSut()

        const httpResponse = await sut.execute({
            body: {
                ...httpRequest.body,
                name: undefined,
            },
        })

        expect(httpResponse.statusCode).toBe(400)
    })

    it('retorna 400 se name for invalido', async () => {
        const { sut } = makSut()

        const httpResponse = await sut.execute({
            body: {
                ...httpRequest.body,
                name: '',
            },
        })

        expect(httpResponse.statusCode).toBe(400)
    })

    it('retorna 400 se date for underfined', async () => {
        const { sut } = makSut()

        const httpResponse = await sut.execute({
            body: {
                ...httpRequest.body,
                date: undefined,
            },
        })

        expect(httpResponse.statusCode).toBe(400)
    })

    it('retorna 400 se date for invalido', async () => {
        const { sut } = makSut()

        const httpResponse = await sut.execute({
            body: {
                ...httpRequest.body,
                date: 'invalid_date',
            },
        })

        expect(httpResponse.statusCode).toBe(400)
    })

    it('retorna 400 se type for underfined', async () => {
        const { sut } = makSut()

        const httpResponse = await sut.execute({
            body: {
                ...httpRequest.body,
                type: undefined,
            },
        })

        expect(httpResponse.statusCode).toBe(400)
    })

    it('retorna 400 se type for invalido', async () => {
        const { sut } = makSut()

        const httpResponse = await sut.execute({
            body: {
                ...httpRequest.body,
                type: 'invalid_type',
            },
        })

        expect(httpResponse.statusCode).toBe(400)
    })

    it('retorna 400 se amount for underfined', async () => {
        const { sut } = makSut()

        const httpResponse = await sut.execute({
            body: {
                ...httpRequest.body,
                amount: undefined,
            },
        })

        expect(httpResponse.statusCode).toBe(400)
    })

    it('retorna 400 se amount for invalido', async () => {
        const { sut } = makSut()

        const httpResponse = await sut.execute({
            body: {
                ...httpRequest.body,
                amount: 0,
            },
        })

        expect(httpResponse.statusCode).toBe(400)
    })

    it('retorna 404 se der UserNotFoundError no execute', async () => {
        const { sut, createTransactionUseCase } = makSut()

        import.meta.jest
            .spyOn(createTransactionUseCase, 'execute')
            .mockRejectedValueOnce(new UserNotFoundError())

        const httpResponse = await sut.execute(httpRequest)

        expect(httpResponse.statusCode).toBe(404)
    })

    it('Should call CreateTransactionUseCase with correct params', async () => {
        const { sut, createTransactionUseCase } = makSut()

        const executeSpy = import.meta.jest.spyOn(
            createTransactionUseCase,
            'execute',
        )

        await sut.execute(httpRequest)

        expect(executeSpy).toHaveBeenCalledWith(httpRequest.body)
    })
})

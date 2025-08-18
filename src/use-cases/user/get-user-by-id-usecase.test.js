/* eslint-disable no-undef */
import { user } from '../../tests/index.js'
import { GetUserByIdUseCase } from './get-user-by-id.js'

describe('GetUserByIdUseCase', () => {
    class getUserByIdRepositoryStub {
        async execute() {
            return user
        }
    }

    const makSut = () => {
        const getUserByIdRepository = new getUserByIdRepositoryStub()

        const sut = new GetUserByIdUseCase(getUserByIdRepository)

        return {
            sut,
            getUserByIdRepository,
        }
    }

    it('should return a user on successfully', async () => {
        const { sut } = makSut()

        const result = await sut.execute(user.id)

        expect(result).toEqual(user)
    })

    it('should call getUserByIdRepository with correct params', async () => {
        const { sut, getUserByIdRepository } = makSut()

        const executeSpy = import.meta.jest.spyOn(
            getUserByIdRepository,
            'execute',
        )

        await sut.execute(user.id)

        expect(executeSpy).toHaveBeenCalledWith(user.id)
    })

    it('should throw if getUserByIdRepository throws Error', async () => {
        const { sut, getUserByIdRepository } = makSut()

        import.meta.jest
            .spyOn(getUserByIdRepository, 'execute')
            .mockRejectedValueOnce(new Error())

        const promise = sut.execute(user.id)

        await expect(promise).rejects.toThrow()
    })
})

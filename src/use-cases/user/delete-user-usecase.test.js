import { user } from '../../tests/index.js'
import { DeleteUserUseCase } from './delete-user.js'

/* eslint-disable no-undef */
describe('DeleteUserUseCase', () => {
    class DeleteUserRepositoryStub {
        async execute() {
            return user
        }
    }

    const makSut = () => {
        const deleteUserRepository = new DeleteUserRepositoryStub()

        const sut = new DeleteUserUseCase(deleteUserRepository)

        return {
            sut,
            deleteUserRepository,
        }
    }

    it('should delete user on successfully', async () => {
        const { sut } = makSut()

        const createdUser = await sut.execute({
            id: user.id,
        })

        expect(createdUser).toEqual(user)
    })

    it('should call DeleteUserRepository with correct params', async () => {
        const { sut, deleteUserRepository } = makSut()

        const executeSpy = import.meta.jest.spyOn(
            deleteUserRepository,
            'execute',
        )

        await sut.execute({
            id: user.id,
        })

        expect(executeSpy).toHaveBeenCalledWith({
            id: user.id,
        })
    })

    it('should throw if DeleteUserRepository throws', async () => {
        const { sut, deleteUserRepository } = makSut()

        import.meta.jest
            .spyOn(deleteUserRepository, 'execute')
            .mockRejectedValueOnce(new Error())

        const promise = sut.execute(user)

        await expect(promise).rejects.toThrow()
    })
})

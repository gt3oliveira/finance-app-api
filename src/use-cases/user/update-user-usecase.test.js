/* eslint-disable no-undef */
import { EmailAlreadyInUseError } from '../../errors/user.js'
import { user } from '../../tests/index.js'
import { UpdateUserUseCase } from './update-user.js'

describe('UpdateUserUseCase', () => {
    class updateUserRepositoryStub {
        async execute() {
            return user
        }
    }

    class getUserByEmailRepositoryStub {
        async execute() {
            return null
        }
    }

    class passwordHasherAdapterStub {
        async execute() {
            return 'hashed_password'
        }
    }

    const makeSut = () => {
        const updateUserRepository = new updateUserRepositoryStub()
        const getUserByEmailRepository = new getUserByEmailRepositoryStub()
        const passwordHasherAdapter = new passwordHasherAdapterStub()

        const sut = new UpdateUserUseCase(
            getUserByEmailRepository,
            updateUserRepository,
            passwordHasherAdapter,
        )

        return {
            sut,
            updateUserRepository,
            getUserByEmailRepository,
            passwordHasherAdapter,
        }
    }

    it('should update user on successfully (whithout email and password)', async () => {
        const { sut } = makeSut()

        const updatedUser = await sut.execute(user.id, {
            first_name: user.first_name,
        })

        expect(updatedUser).toBe(user)
    })

    it('should update user on successfully (whithout email)', async () => {
        const { sut, getUserByEmailRepository } = makeSut()

        const executeSpy = import.meta.jest.spyOn(
            getUserByEmailRepository,
            'execute',
        )

        const updatedUser = await sut.execute(user.id, {
            email: user.email,
        })

        expect(executeSpy).toHaveBeenCalledWith(user.email)
        expect(updatedUser).toBe(user)
    })

    it('should update user on successfully (whithout password)', async () => {
        const { sut, passwordHasherAdapter } = makeSut()

        const executeSpy = import.meta.jest.spyOn(
            passwordHasherAdapter,
            'execute',
        )

        const updatedUser = await sut.execute(user.id, {
            password: user.password,
        })

        expect(executeSpy).toHaveBeenCalledWith(user.password)
        expect(updatedUser).toBe(user)
    })

    it('should throw if getUserByEmailRepository throws Error', async () => {
        const { sut, getUserByEmailRepository } = makeSut()

        import.meta.jest
            .spyOn(getUserByEmailRepository, 'execute')
            .mockRejectedValueOnce(new EmailAlreadyInUseError(user.email))

        const promise = sut.execute('faker_userId', {
            email: user.email,
        })

        await expect(promise).rejects.toThrow(
            new EmailAlreadyInUseError(user.email),
        )
    })

    it('should call updateUserRepository with correct params', async () => {
        const { sut, updateUserRepository } = makeSut()

        const executeSpy = import.meta.jest.spyOn(
            updateUserRepository,
            'execute',
        )

        const updateUserParams = {
            first_name: user.first_name,
            last_name: user.last_name,
            email: user.email,
            password: 'hashed_password',
        }

        await sut.execute(user.id, updateUserParams)

        expect(executeSpy).toHaveBeenCalledWith(user.id, updateUserParams)
    })

    it('should throw if getUserByEmailRepository throws', async () => {
        const { sut, getUserByEmailRepository } = makeSut()

        import.meta.jest
            .spyOn(getUserByEmailRepository, 'execute')
            .mockRejectedValueOnce(new Error())

        const promise = sut.execute(user.id, {
            email: user.email,
        })

        await expect(promise).rejects.toThrow(new Error())
    })

    it('should throw if passwordHasherAdapter throws', async () => {
        const { sut, passwordHasherAdapter } = makeSut()

        import.meta.jest
            .spyOn(passwordHasherAdapter, 'execute')
            .mockRejectedValueOnce(new Error())

        const promise = sut.execute(user.id, {
            password: user.password,
        })

        await expect(promise).rejects.toThrow(new Error())
    })

    it('should throw if updateUserRepository throws', async () => {
        const { sut, updateUserRepository } = makeSut()

        import.meta.jest
            .spyOn(updateUserRepository, 'execute')
            .mockRejectedValueOnce(new Error())

        const promise = sut.execute(user.id, {
            first_name: user.first_name,
        })

        await expect(promise).rejects.toThrow(new Error())
    })
})

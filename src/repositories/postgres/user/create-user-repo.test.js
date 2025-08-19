import { PostgresCreateUserRepository } from './create-user.js'
import { user } from '../../../tests/index.js'
import { prisma } from '../../../../prisma/prisma.js'

describe('CreateUserRepository', () => {
    it('should create a user', async () => {
        const sut = new PostgresCreateUserRepository()

        const result = await sut.execute(user)

        expect(result.id).toBe(user.id)
        expect(result.first_name).toBe(user.first_name)
        expect(result.last_name).toBe(user.last_name)
        expect(result.email).toBe(user.email)
        expect(result.password).toBe(user.password)
    })

    it('should call Prisma with correct params', async () => {
        const sut = new PostgresCreateUserRepository()
        const executeSpy = import.meta.jest.spyOn(prisma.user, 'create')

        await sut.execute(user)

        expect(executeSpy).toHaveBeenCalledWith({
            data: user,
        })
    })

    it('should throw Prisma throws', async () => {
        const sut = new PostgresCreateUserRepository()
        import.meta.jest
            .spyOn(prisma.user, 'create')
            .mockRejectedValueOnce(new Error())

        const promise = sut.execute(user)

        await expect(promise).rejects.toThrow()
    })
})

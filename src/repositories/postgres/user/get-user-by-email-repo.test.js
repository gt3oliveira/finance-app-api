import { prisma } from '../../../../prisma/prisma.js'
import { user as fakeUser } from '../../../tests/index'
import { PostgresGetUserByEmailRepository } from './get-user-by-email.js'

describe('GetUserByEmailRepository', () => {
    it('should get user by email on db', async () => {
        const user = await prisma.user.create({ data: fakeUser })
        const sut = new PostgresGetUserByEmailRepository()

        const result = await sut.execute(user.email)

        expect(result).toStrictEqual(user)
    })

    it('should call Prisma with correct params', async () => {
        const sut = new PostgresGetUserByEmailRepository()
        const executeSpy = import.meta.jest.spyOn(prisma.user, 'findUnique')

        await sut.execute(fakeUser.email)

        expect(executeSpy).toHaveBeenCalledWith({
            where: { email: fakeUser.email },
        })
    })

    it('should throw Prisma throws', async () => {
        const sut = new PostgresGetUserByEmailRepository()
        import.meta.jest
            .spyOn(prisma.user, 'findUnique')
            .mockRejectedValueOnce(new Error())

        const promise = sut.execute(fakeUser.email)

        await expect(promise).rejects.toThrow()
    })
})

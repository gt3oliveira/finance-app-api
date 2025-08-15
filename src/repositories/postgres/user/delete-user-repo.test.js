import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library.js'
import { prisma } from '../../../../prisma/prisma.js'
import { user } from '../../../tests'
import { PostgresDeleteUserRepository } from './delete-user.js'
import { UserNotFoundError } from '../../../errors/user.js'

/* eslint-disable no-undef */
describe('DeleteUserRepository', () => {
    it('should delete a user', async () => {
        await prisma.user.create({ data: user })

        const sut = new PostgresDeleteUserRepository()

        const result = await sut.execute(user.id)

        expect(result).toStrictEqual(user)
    })

    it('should call Prisma with correct params', async () => {
        await prisma.user.create({ data: user })
        const sut = new PostgresDeleteUserRepository()
        const executeSpy = jest.spyOn(prisma.user, 'delete')

        await sut.execute(user.id)

        expect(executeSpy).toHaveBeenCalledWith({ where: { id: user.id } })
    })

    it('should throw Prisma on UserNotFoundError throws', async () => {
        const sut = new PostgresDeleteUserRepository()
        jest.spyOn(prisma.user, 'delete').mockRejectedValueOnce(
            new PrismaClientKnownRequestError('', {
                code: 'P2025',
            }),
        )

        const promise = sut.execute(user.id)

        await expect(promise).rejects.toThrow(new UserNotFoundError(user.id))
    })

    it('should throw Prisma throws', async () => {
        const sut = new PostgresDeleteUserRepository()
        jest.spyOn(prisma.user, 'delete').mockRejectedValueOnce(new Error())

        const promise = sut.execute(user.id)

        await expect(promise).rejects.toThrow()
    })
})

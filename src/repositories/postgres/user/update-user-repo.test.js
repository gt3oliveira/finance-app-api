/* eslint-disable no-undef */
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library.js'
import { prisma } from '../../../../prisma/prisma.js'
import { user as fakeUser } from '../../../tests/index'
import { PostgresUpdateUserRepository } from './update-user.js'
import { UserNotFoundError } from '../../../errors'

describe('UpdateUserRepository', () => {
    it('should update a user', async () => {
        const user = await prisma.user.create({ data: fakeUser })
        const sut = new PostgresUpdateUserRepository()

        const result = await sut.execute(user.id, { first_name: 'new name' })

        expect(result.first_name).toBe('new name')
    })

    it('should call Prisma with correct params', async () => {
        const user = await prisma.user.create({ data: fakeUser })
        const sut = new PostgresUpdateUserRepository()
        const executeSpy = jest.spyOn(prisma.user, 'update')

        await sut.execute(user.id, { first_name: 'new name' })

        expect(executeSpy).toHaveBeenCalledWith({
            where: { id: user.id },
            data: { first_name: 'new name' },
        })
    })

    it('should throw Prisma on UserNotFoundError throws', async () => {
        const sut = new PostgresUpdateUserRepository()
        jest.spyOn(prisma.user, 'update').mockRejectedValueOnce(
            new PrismaClientKnownRequestError('', {
                code: 'P2025',
            }),
        )

        const promise = sut.execute(fakeUser.id)

        await expect(promise).rejects.toThrow(
            new UserNotFoundError(fakeUser.id),
        )
    })

    it('should throw Prisma throws', async () => {
        const sut = new PostgresUpdateUserRepository()
        jest.spyOn(prisma.user, 'update').mockRejectedValueOnce(new Error())

        const promise = sut.execute(fakeUser)

        await expect(promise).rejects.toThrow()
    })
})

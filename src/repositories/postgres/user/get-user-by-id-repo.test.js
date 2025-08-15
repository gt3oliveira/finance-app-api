/* eslint-disable no-undef */
import { prisma } from '../../../../prisma/prisma.js'
import { user as fakeUser } from '../../../tests/index'
import { PostgresGetUserByIdRepository } from './get-user-by-id.js'

describe('GetUserByIdRepository', () => {
    it('should get user by id on db', async () => {
        const user = await prisma.user.create({ data: fakeUser })
        const sut = new PostgresGetUserByIdRepository()

        const result = await sut.execute(user.id)

        expect(result).toStrictEqual(user)
    })

    it('should call Prisma with correct params', async () => {
        const sut = new PostgresGetUserByIdRepository()
        const executeSpy = jest.spyOn(prisma.user, 'findUnique')

        await sut.execute(fakeUser.id)

        expect(executeSpy).toHaveBeenCalledWith({ where: { id: fakeUser.id } })
    })

    it('should throw Prisma throws', async () => {
        const sut = new PostgresGetUserByIdRepository()
        jest.spyOn(prisma.user, 'findUnique').mockRejectedValueOnce(new Error())

        const promise = sut.execute(fakeUser.id)

        await expect(promise).rejects.toThrow()
    })
})

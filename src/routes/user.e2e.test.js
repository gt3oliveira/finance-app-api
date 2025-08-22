import request from 'supertest'
import { app } from '../app.js'
import { transaction, user } from '../tests/index.js'
import { TransactionType } from '@prisma/client'

describe('User Routes', () => {
    it('POST /api/user return 201', async () => {
        const response = await request(app).post('/api/user').send({
            first_name: user.first_name,
            last_name: user.last_name,
            email: user.email,
            password: user.password,
        })

        expect(response.statusCode).toBe(201)
    })

    it('GET /api/user/:userId return 200', async () => {
        const { body: createdUser } = await request(app)
            .post('/api/user')
            .send({
                ...user,
                id: undefined,
            })

        const response = await request(app)
            .get(`/api/user`)
            .set('Authorization', `Bearer ${createdUser.tokens.accessToken}`)

        expect(response.statusCode).toBe(200)
        expect(response.body.id).toBe(createdUser.id)
    })

    it('PATCH /api/user/:userId return 200', async () => {
        const { body: createdUser } = await request(app)
            .post('/api/user')
            .send({
                ...user,
                id: undefined,
            })

        const response = await request(app)
            .patch(`/api/user`)
            .set('Authorization', `Bearer ${createdUser.tokens.accessToken}`)
            .send({
                first_name: user.first_name,
                last_name: user.last_name,
                email: user.email,
                password: user.password,
            })

        expect(response.statusCode).toBe(200)
        expect(response.body.first_name).toEqual(user.first_name)
        expect(response.body.last_name).toEqual(user.last_name)
        expect(response.body.email).toEqual(user.email)
        expect(response.body.password).not.toBe(user.password)
    })

    it('DELETE /api/user/:userId return 200', async () => {
        const { body: createdUser } = await request(app)
            .post('/api/user')
            .send({
                ...user,
                id: undefined,
            })

        const response = await request(app)
            .delete(`/api/user`)
            .set('Authorization', `Bearer ${createdUser.tokens.accessToken}`)

        expect(response.statusCode).toBe(200)
        expect(response.body.id).toBe(createdUser.id)
    })

    it('GET /api/user/:userId/balance return 200', async () => {
        const { body: createdUser } = await request(app)
            .post('/api/user')
            .send({
                ...user,
                id: undefined,
            })

        await request(app)
            .post('/api/transactions')
            .set('Authorization', `Bearer ${createdUser.tokens.accessToken}`)
            .send({
                user_id: createdUser.id,
                name: transaction.name,
                date: transaction.date,
                type: TransactionType.EARNING,
                amount: 10000,
            })

        await request(app)
            .post('/api/transactions')
            .set('Authorization', `Bearer ${createdUser.tokens.accessToken}`)
            .send({
                user_id: createdUser.id,
                name: transaction.name,
                date: transaction.date,
                type: TransactionType.EXPENSE,
                amount: 2000,
            })

        await request(app)
            .post('/api/transactions')
            .set('Authorization', `Bearer ${createdUser.tokens.accessToken}`)
            .send({
                user_id: createdUser.id,
                name: transaction.name,
                date: transaction.date,
                type: TransactionType.INVESTMENT,
                amount: 1000,
            })

        const response = await request(app)
            .get(`/api/user/balance`)
            .set('Authorization', `Bearer ${createdUser.tokens.accessToken}`)

        expect(response.statusCode).toBe(200)
        expect(response.body).toStrictEqual({
            totalEarnings: '10000',
            totalExpenses: '2000',
            totalInvestments: '1000',
            balance: '7000',
        })
    })

    it('POST /api/user return 400 if email is already in use', async () => {
        const { body: createdUser } = await request(app)
            .post('/api/user')
            .send({
                ...user,
                id: undefined,
            })

        const response = await request(app)
            .post('/api/user')
            .send({
                ...user,
                id: undefined,
                email: createdUser.email,
            })

        expect(response.status).toBe(400)
    })

    it('POST /api/user return 400 if email is invalid', async () => {
        const response = await request(app)
            .post('/api/user')
            .send({
                ...user,
                id: undefined,
                email: 'invalid_email',
            })

        expect(response.status).toBe(400)
    })

    it('POST /api/user return 400 if password required at least 6 characters', async () => {
        const response = await request(app)
            .post('/api/user')
            .send({
                ...user,
                id: undefined,
                password: '12345',
            })

        expect(response.status).toBe(400)
    })

    it('POST /api/user/login return 200 with tokens and user credentails', async () => {
        const { body: createdUser } = await request(app)
            .post('/api/user')
            .send({
                ...user,
                id: undefined,
            })

        const response = await request(app).post('/api/user/login').send({
            email: createdUser.email,
            password: user.password,
        })

        expect(response.statusCode).toBe(200)
        expect(response.body.tokens.accessToken).toBeDefined()
        expect(response.body.tokens.refreshToken).toBeDefined()
        expect(response.body.id).toEqual(createdUser.id)
    })

    it('POST /api/user/refresh-token return 200 with new tokens', async () => {
        const { body: createdUser } = await request(app)
            .post('/api/user')
            .send({
                ...user,
                id: undefined,
            })

        const response = await request(app)
            .post('/api/user/refresh-token')
            .send({
                refreshToken: createdUser.tokens.refreshToken,
            })

        expect(response.statusCode).toBe(200)
        expect(response.body.accessToken).toBeDefined()
        expect(response.body.refreshToken).toBeDefined()
    })
})

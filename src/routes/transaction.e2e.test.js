import { app } from '../app.js'
import request from 'supertest'
import { transaction, user as fakerUser } from '../tests/index.js'

describe('Transaction Routes E2E Test', () => {
    const from = '2024-01-01'
    const to = '2024-01-31'

    it('POST /api/transactions should to create a transaction', async () => {
        const user = await request(app)
            .post('/api/user')
            .send({
                ...fakerUser,
                id: undefined,
            })
        const response = await request(app)
            .post('/api/transactions')
            .set('Authorization', `Bearer ${user.body.tokens.accessToken}`)
            .send({
                user_id: user.body.id,
                name: transaction.name,
                date: transaction.date,
                type: transaction.type,
                amount: transaction.amount,
            })

        expect(response.statusCode).toBe(200)
        expect(response.body.user_id).toStrictEqual(user.body.id)
        expect(response.body.name).toStrictEqual(transaction.name)
        expect(response.body.type).toStrictEqual(transaction.type)
        expect(response.body.amount).toStrictEqual(String(transaction.amount))
    })

    it('GET /api/transactions?userId should return 200 and a list of transactions', async () => {
        const { body: createdUser } = await request(app)
            .post('/api/user')
            .send({
                ...fakerUser,
                id: undefined,
            })

        await request(app)
            .post('/api/transactions')
            .set('Authorization', `Bearer ${createdUser.tokens.accessToken}`)
            .send({
                user_id: createdUser.id,
                name: transaction.name,
                date: transaction.date,
                type: transaction.type,
                amount: transaction.amount,
            })

        const response = await request(app)
            .get(`/api/transactions?from=${from}&to=${to}`)
            .set('Authorization', `Bearer ${createdUser.tokens.accessToken}`)

        expect(response.statusCode).toBe(200)
        expect(response.body[0].user_id).toStrictEqual(createdUser.id)
    })

    it('PATCH /api/transactions/:transactionId should return 200 and update a transaction', async () => {
        const user = await request(app)
            .post('/api/user')
            .send({
                ...fakerUser,
                id: undefined,
            })
        const transactionParams = await request(app)
            .post('/api/transactions')
            .set('Authorization', `Bearer ${user.body.tokens.accessToken}`)
            .send({
                user_id: user.body.id,
                name: transaction.name,
                date: transaction.date,
                type: transaction.type,
                amount: transaction.amount,
            })

        const response = await request(app)
            .patch(`/api/transactions/${transactionParams.body.id}`)
            .set('Authorization', `Bearer ${user.body.tokens.accessToken}`)
            .send({
                name: fakerUser.first_name,
                amount: 1000,
            })

        expect(response.statusCode).toBe(200)
        expect(response.body.name).toStrictEqual(fakerUser.first_name)
        expect(response.body.amount).toStrictEqual('1000')
    })

    it('DELETE /api/transactions/:transactionId should return 200 and delete a transaction', async () => {
        const user = await request(app)
            .post('/api/user')
            .send({
                ...fakerUser,
                id: undefined,
            })
        const { body: transactionParams } = await request(app)
            .post('/api/transactions')
            .set('Authorization', `Bearer ${user.body.tokens.accessToken}`)
            .send({
                user_id: user.body.id,
                name: transaction.name,
                date: transaction.date,
                type: transaction.type,
                amount: transaction.amount,
            })

        const response = await request(app)
            .delete(`/api/transactions/${transactionParams.id}`)
            .set('Authorization', `Bearer ${user.body.tokens.accessToken}`)

        expect(response.statusCode).toBe(200)
        expect(response.body.id).toBe(transactionParams.id)
    })

    it('PATCH /api/transactions/:transactionId should return 404 if transaction not found', async () => {
        const user = await request(app)
            .post('/api/user')
            .send({
                ...fakerUser,
                id: undefined,
            })
        const response = await request(app)
            .patch(`/api/transactions/${transaction.id}`)
            .set('Authorization', `Bearer ${user.body.tokens.accessToken}`)
            .send({
                name: transaction.name,
                amount: 1000,
            })

        expect(response.statusCode).toBe(404)
    })

    it('DELETE /api/transactions/:transactionId should return 404 if transaction not found', async () => {
        const user = await request(app)
            .post('/api/user')
            .send({
                ...fakerUser,
                id: undefined,
            })
        const response = await request(app)
            .delete(`/api/transactions/${transaction.id}`)
            .set('Authorization', `Bearer ${user.body.tokens.accessToken}`)

        expect(response.statusCode).toBe(404)
    })
})

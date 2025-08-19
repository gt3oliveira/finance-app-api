import { app } from '../app.js'
import request from 'supertest'
import { transaction, user as fakerUser } from '../tests/index.js'

describe('Transaction Routes E2E Test', () => {
    it('POST /api/transactions should to create a transaction', async () => {
        const user = await request(app)
            .post('/api/user')
            .send({
                ...fakerUser,
                id: undefined,
            })
        const response = await request(app).post('/api/transactions').send({
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
        const user = await request(app)
            .post('/api/user')
            .send({
                ...fakerUser,
                id: undefined,
            })
        await request(app).post('/api/transactions').send({
            user_id: user.body.id,
            name: transaction.name,
            date: transaction.date,
            type: transaction.type,
            amount: transaction.amount,
        })

        const response = await request(app).get(
            `/api/transactions?userId=${user.body.id}`,
        )

        expect(response.statusCode).toBe(200)
        expect(response.body[0].user_id).toStrictEqual(user.body.id)
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
            .send({
                user_id: user.body.id,
                name: transaction.name,
                date: transaction.date,
                type: transaction.type,
                amount: transaction.amount,
            })

        const response = await request(app)
            .patch(`/api/transactions/${transactionParams.body.id}`)
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
            .send({
                user_id: user.body.id,
                name: transaction.name,
                date: transaction.date,
                type: transaction.type,
                amount: transaction.amount,
            })

        const response = await request(app).delete(
            `/api/transactions/${transactionParams.id}`,
        )

        expect(response.statusCode).toBe(200)
        expect(response.body.id).toBe(transactionParams.id)
    })

    it('PATCH /api/transactions/:transactionId should return 404 if transaction not found', async () => {
        const response = await request(app)
            .patch(`/api/transactions/${transaction.id}`)
            .send({
                name: transaction.name,
                amount: 1000,
            })

        expect(response.statusCode).toBe(404)
    })

    it('DELETE /api/transactions/:transactionId should return 404 if transaction not found', async () => {
        const response = await request(app).delete(
            `/api/transactions/${transaction.id}`,
        )

        expect(response.statusCode).toBe(404)
    })

    it('GET /api/transactions?userId should return 404 if transaction not found', async () => {
        const response = await request(app).get(
            `/api/transactions?userId=${transaction.id}`,
        )

        expect(response.statusCode).toBe(404)
    })
})

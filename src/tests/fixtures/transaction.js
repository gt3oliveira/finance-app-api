import { faker } from '@faker-js/faker'

export const transaction = {
    user_id: faker.string.uuid(),
    id: faker.string.uuid(),
    name: faker.commerce.productName(),
    date: '2011-10-05T14:48:00.000Z',
    type: 'EXPENSE',
    amount: Number(faker.finance.amount()),
}

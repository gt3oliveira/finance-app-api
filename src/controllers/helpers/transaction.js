import { notFound } from './http.js'

export const transactionNotFound = () => {
    return notFound({ message: 'Transaction not found.' })
}

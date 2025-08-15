import { PasswordHasherAdapter } from './password-hasher'

/* eslint-disable no-undef */
describe('PasswordHasherAdapter', () => {
    it('should return a Password Hasher', async () => {
        const sut = new PasswordHasherAdapter()

        const password = 'any_password'
        const hashedPassword = await sut.execute(password)

        expect(hashedPassword).toBeTruthy()
        expect(hashedPassword).not.toBe(password)
        expect(typeof hashedPassword).toBe('string')
    })
})

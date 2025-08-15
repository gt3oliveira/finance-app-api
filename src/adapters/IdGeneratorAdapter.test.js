import { IdGeneratorAdapter } from './id-generator'
import validator from 'validator'

/* eslint-disable no-undef */
describe('IdGeneratorAdapter', () => {
    it('should return a uuid', () => {
        const sut = new IdGeneratorAdapter()
        const id = sut.execute()

        expect(id).toBeTruthy()
        expect(typeof id).toBe('string')
        expect(validator.isUUID(id)).toBe(true)
    })
})

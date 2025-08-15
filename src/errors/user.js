export class EmailAlreadyInUseError extends Error {
    constructor(email) {
        super(`The Email ${email} is already in use.`)
        this.name = 'EmailAlreadyInUseError'
    }
}

export class UserNotFoundError extends Error {
    constructor(userId) {
        super(`User with ID ${userId} not found.`)
        this.name = 'UserNotFoundError'
    }
}

export class DeleteUserUseCase {
    constructor(deleteUserRepository) {
        this.deleteUserRepository = deleteUserRepository
    }

    async execute(userId) {
        const deleteUser = await this.deleteUserRepository.execute(userId)

        return deleteUser
    }
}

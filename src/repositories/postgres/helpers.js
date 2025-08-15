export const UpdateParams = (userId, updateParams) => {
    const updateFields = []
    const updateValues = []

    Object.keys(updateParams).forEach((key) => {
        updateFields.push(`${key} = $${updateFields.length + 1}`)
        updateValues.push(updateParams[key])
    })

    updateValues.push(userId)

    return {
        updateValues,
        updateFields,
    }
}

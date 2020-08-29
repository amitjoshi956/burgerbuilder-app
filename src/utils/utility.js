/** A utility to immutably update particular property values in an object
 * @param oldObject The object to be updated
 * @param updatedProperties The properties to be modified of the given object
 */
export const updateObject = (oldObject, updatedProperties) => {
    return {
        ...oldObject,
        ...updatedProperties,
    }
}

/** A utility to validate rules on a given value
 * @param value The value to be validated
 * @param rules The rules to be validated against the given value
 */
export const checkValidity = (value, rules) => {
    let isValid = true

    if (rules.required) isValid = isValid && value.trim() !== ''
    if (rules.minLength) isValid = isValid && value.length >= rules.minLength
    if (rules.maxLength) isValid = isValid && value.length <= rules.maxLength
    if (rules.isNumeric) {
        const pattern = /^\d+$/
        isValid = isValid && pattern.test(value)
    }
    if (rules.isEmail) {
        const pattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.]+\.[a-zA-Z]{2,4}$/
        isValid = isValid && pattern.test(value)
    }

    return isValid
}
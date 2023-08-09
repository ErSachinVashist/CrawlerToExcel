const validateIt = (val) => {
    const isValid = val !== null && val !== undefined && typeof val === 'string'
    if (!isValid) return ""
    return val.replace(/Click here/g, '')
        .replace(/\t/g, '')
        .replace(/\n/g, '')
        .replace(": ", '')
        .trim()
}

module.exports = validateIt 
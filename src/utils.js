export function capitalize(phrase) {
    return phrase
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

export function remove_spaces(text) {
    return text.replace(/\s/g, '')
}
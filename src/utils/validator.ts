export const passwordRegex = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/

export const passwordMinimumLength = 8

export const passwordContainsUppercase = /[A-Z]/

export const passwordContainsLowercase = /[a-z]/

export const passwordContainsNumber = /[0-9]/

export const passwordContainsSpecial = /[#?!@$%^&*-]/

export const usernameRegex = /^[a-zA-Z0-9_]{3,18}$/

export const usernameCharactersRegex = /^[a-zA-Z0-9_]+$/

export const usernameMinimumLength = 3

export const usernameMaximumLength = 18

export const usernameValidCharacter = /^[a-zA-Z0-9_]+$/

// eslint-disable-next-line no-useless-escape
export const urlRegex = /^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_\+.~#?&\/=]*)$/

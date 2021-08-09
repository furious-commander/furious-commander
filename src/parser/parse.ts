import { Argument } from './type'

function prepareNumericalString(string: string) {
  const replaced = string && string.replace ? string.replace(/_/g, '') : string

  if (replaced === '') {
    return null
  }

  return replaced
}

function parseNumericalUnit(rawValue: string) {
  if (/[kK]$/.test(rawValue)) {
    return { b: BigInt(1000), n: 1e3 }
  }

  if (/[mM]$/.test(rawValue)) {
    return { b: BigInt(1000000), n: 1e6 }
  }

  if (/[bB]$/.test(rawValue)) {
    return { b: BigInt(1000000000), n: 1e9 }
  }

  if (/[tT]$/.test(rawValue)) {
    return { b: BigInt(1000000000000), n: 1e12 }
  }

  return null
}

function parseNumber(option: Argument, rawValue: string) {
  const multiplier = parseNumericalUnit(rawValue)
  const parsableString = multiplier ? rawValue.slice(0, rawValue.length - 1) : rawValue

  if (!/^\-?[0-9_]+$/.test(parsableString)) {
    return Error('Expected number for ' + option.key + ', got ' + rawValue)
  }
  const parsedValue = parseInt(prepareNumericalString(parsableString) as string, 10)
  const value = multiplier ? parsedValue * multiplier.n : parsedValue

  if (isNaN(value)) {
    return Error('Expected number for ' + option.key + ', got ' + rawValue)
  }

  if (option.minimum !== undefined && value < option.minimum) {
    return Error('[' + option.key + '] must be at least ' + option.minimum)
  }

  if (option.maximum !== undefined && value > option.maximum) {
    return Error('[' + option.key + '] must be at most ' + option.maximum)
  }

  return { value, skip: 1 }
}

function parseBigInt(option: Argument, rawValue: string) {
  try {
    const multiplier = parseNumericalUnit(rawValue)
    const parsableString = multiplier ? rawValue.slice(0, rawValue.length - 1) : rawValue
    const parsedValue = BigInt(prepareNumericalString(parsableString) as string)
    const value = multiplier ? parsedValue * multiplier.b : parsedValue

    if (option.minimum !== undefined && value < option.minimum) {
      return Error('[' + option.key + '] must be at least ' + option.minimum)
    }

    if (option.maximum !== undefined && value > option.maximum) {
      return Error('[' + option.key + '] must be at most ' + option.maximum)
    }

    return { value, skip: 1 }
  } catch {
    return Error('Expected BigInt for ' + option.key + ', got ' + rawValue)
  }
}

function validateStringLength(option: Argument, string: string) {
  if (option.minimumLength === undefined && string.length === 0) {
    return Error('[' + option.key + '] must not be empty')
  }

  if (option.length && string.length !== option.length) {
    return Error('[' + option.key + '] must have length of ' + option.length + ' characters')
  }

  if (option.minimumLength && string.length < option.minimumLength) {
    return Error('[' + option.key + '] must have length of at least ' + option.minimumLength + ' characters')
  }

  if (option.maximumLength && string.length > option.maximumLength) {
    return Error('[' + option.key + '] must have length of at most ' + option.maximumLength + ' characters')
  }
}

function parseHexString(option: Argument, rawValue: string) {
  const lowercase = rawValue.toLowerCase()
  const hexString = lowercase.startsWith('0x') ? lowercase.slice(2) : lowercase

  if (!/^[a-f0-9]+$/.test(hexString) && hexString.length > 0) {
    return Error('Expected hex string for ' + option.key + ', got ' + rawValue)
  }
  const lengthError = validateStringLength(option, hexString)

  if (lengthError) {
    return lengthError
  }

  if (!option.oddLength) {
    if (hexString.length % 2 === 1) {
      return Error('[' + option.key + '] must have even length')
    }
  }

  return {
    value: hexString,
    skip: 1,
  }
}

export function parseValue(
  option: Argument,
  rawValue: string,
): Error | { value: boolean | number | bigint | string; skip: number } {
  const { type } = option

  if (type === 'boolean') {
    if (rawValue === 'true') {
      return { value: true, skip: 1 }
    } else if (rawValue === 'false') {
      return { value: false, skip: 1 }
    }

    return { value: true, skip: 0 }
  } else if (type === 'number') {
    return parseNumber(option, rawValue)
  } else if (type === 'bigint') {
    return parseBigInt(option, rawValue)
  } else if (type === 'hex-string') {
    return parseHexString(option, rawValue)
  } else {
    return validateStringLength(option, rawValue) || { value: rawValue, skip: 1 }
  }
}

import { Command } from './command'

const optionMetadataKey = Symbol('Option')

/**
 * interface for `Option` decorator
 */
export interface IOption<T = string | number | bigint | boolean> {
    key: string
    description: string
    type?: 'string' | 'number' | 'bigint' | 'boolean'
    alias?: string
    required?: boolean
    default?: T
    minimum?: number | bigint
    conflicts?: string
    defaultDescription?: string
    handler?: () => void
    envKey?: string
}

/**
 * Creates CLI Option based on the passed `options` and assigns its value to the property
 *
 * @param options IOption object, which defines the option of the command
 */
export function Option(options: IOption): PropertyDecorator {
    return Reflect.metadata(optionMetadataKey, options)
}

/**
 * Get the yargs option key from ExternalOption metadata on the given property
 *
 * @param target Command instance
 * @param propertyKey Property of the command instance
 */
export function getOption<T extends Command, K extends Extract<keyof T, string>>(target: T, propertyKey: K): IOption {
    return Reflect.getMetadata(optionMetadataKey, target, propertyKey)
}

const externalOptionMetadataKey = Symbol('ExternalOption')

/**
 * Init the parameter with value of the desired option, which is defined outside of the class
 *
 * @param key CLI option reference of the required option value (without dashes)
 */
export function ExternalOption(key: string): PropertyDecorator {
    return Reflect.metadata(externalOptionMetadataKey, key)
}

/**
 * Get the yargs option key from ExternalOption metadata on the given property
 *
 * @param target Command instance
 * @param propertyKey Property of the command instance
 */
export function getExternalOption<T extends Command, K extends Extract<keyof T, string>>(target: T, propertyKey: K): string {
    return Reflect.getMetadata(externalOptionMetadataKey, target, propertyKey)
}

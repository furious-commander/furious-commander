import { Command } from './command'

const optionMetadataKey = Symbol("Option");

type Choices = ReadonlyArray<string | number | true | undefined>;

/**
 * interface for `Option` decorator
 */
export interface IOption<T = unknown> {
  key: string
  describe: string
  type?: "string" | "boolean" | 'array' | 'number' | 'count'
  /** string or array of strings, alias(es) for the canonical option key */
  alias?: string | ReadonlyArray<string>
  /**
   * Whether the option is required to pass
   *
   * DemandOption in yargs
  */
  required?: boolean
  default?: T
  /** value or array of values, limit valid option arguments to a predefined set */
  choices?: Choices
  /** function, coerce or transform parsed command line values into another value */
  coerce?: (arg: unknown) => T
  /** boolean, interpret option as a path to a JSON config file */
  config?: boolean
  /** string or object, require certain keys not to be set */
  conflicts?: string | ReadonlyArray<string> | { [key: string]: string | ReadonlyArray<string> }
  /** string, use this description for the default value in help content */
  defaultDescription?: string
  /** boolean or string, mark the argument as deprecated */
  deprecated?: boolean | string
  /** string, when displaying usage instructions place the option under an alternative group heading */
  group?: string
  /** don't display option in help output. */
  hidden?: boolean
  /**  string or object, require certain keys to be set */
  implies?: string | ReadonlyArray<string> | { [key: string]: string | ReadonlyArray<string> }
  /** number, specify how many arguments should be consumed for the option */
  nargs?: number
}

/**
 * Creates CLI Option based on the passed `options` and assigns its value to the property
 *
 * @param options IOption object, which defines the option of the command
 */
export function Option(options: IOption): PropertyDecorator {
  return Reflect.metadata(optionMetadataKey, options);
}

/**
 * Get the yargs option key from ExternalOption metadata on the given property
 *
 * @param target Command instance
 * @param propertyKey Property of the command instance
 */
export function getOption<T extends Command, K extends Extract<keyof T, string>>(target: T, propertyKey: K): IOption {
  return Reflect.getMetadata(optionMetadataKey, target, propertyKey);
}

const externalOptionMetadataKey = Symbol("ExternalOption");

/**
 * Init the parameter with value of the desired option, which is defined outside of the class
 *
 * @param key CLI option reference of the required option value (without dashes)
 */
export function ExternalOption(key: string): PropertyDecorator {
  return Reflect.metadata(externalOptionMetadataKey, key);
}


/**
 * Get the yargs option key from ExternalOption metadata on the given property
 *
 * @param target Command instance
 * @param propertyKey Property of the command instance
 */
export function getExternalOption<T extends Command, K extends Extract<keyof T, string>>(target: T, propertyKey: K): string {
  return Reflect.getMetadata(externalOptionMetadataKey, target, propertyKey);
}

import { Command } from './command'

const argumentMetadataKey = Symbol("Argument");

/**
 * interface for `Argument` decorator
 */
export interface IArgument<T = unknown> {
  key: string
  /**
   * Whether the argument is required to pass
  */
  required?: boolean
  default?: T
  /** string or array of strings, see `alias()` */
  alias?: string | ReadonlyArray<string>
  /** boolean, interpret option as an array, see `array()` */
  array?: boolean
  /** value or array of values, limit valid option arguments to a predefined set, see `choices()` */
  choices?: ReadonlyArray<string | number | true | undefined>
  /** function, coerce or transform parsed command line values into another value, see `coerce()` */
  coerce?: (arg: unknown) => unknown
  /** string or object, require certain keys not to be set, see `conflicts()` */
  conflicts?: string | ReadonlyArray<string> | { [key: string]: string | ReadonlyArray<string> }
  /** string, the option description for help content, see `describe()` */
  desc?: string
  /** string, the option description for help content, see `describe()` */
  describe?: string
  /** string or object, require certain keys to be set, see `implies()` */
  implies?: string | ReadonlyArray<string> | { [key: string]: string | ReadonlyArray<string> }
  /** boolean, apply path.normalize() to the option, see normalize() */
  normalize?: boolean
  type?: "boolean" | "number" | "string"
}

/**
 * Creates CLI argument based on the passed `options` and assigns its value to the property
 *
 * @param options IOption object, which defines the argument of the command
 */
export function Argument(options: IArgument): PropertyDecorator {
  return Reflect.metadata(argumentMetadataKey, options);
}

/**
 * Get the yargs argument option key from ExternalOption metadata on the given property
 *
 * @param target Command instance
 * @param propertyKey Property of the command instance
 */
export function getArgument<T extends Command, K extends Extract<keyof T, string>>(target: T, propertyKey: K): IArgument {
  return Reflect.getMetadata(argumentMetadataKey, target, propertyKey);
}

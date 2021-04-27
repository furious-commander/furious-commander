import { Command } from "./command";

const argumentMetadataKey = Symbol("Argument");

/**
 * interface for `Argument` decorator
 */
export interface IArgument<T = string | number | bigint | boolean> {
  key: string;
  description: string;
  type?: "string" | "number" | "bigint" | "boolean";
  alias?: string;
  required?: boolean;
  default?: T;
  minimum?: number | bigint;
  conflicts?: string;
  defaultDescription?: string;
  envKey?: string;
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
export function getArgument<
  T extends Command,
  K extends Extract<keyof T, string>
>(target: T, propertyKey: K): IArgument {
  return Reflect.getMetadata(argumentMetadataKey, target, propertyKey);
}

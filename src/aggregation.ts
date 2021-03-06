import { Command } from './command'

const aggregationMetadataKey = Symbol("Aggregation");

/**
 * Aggregate the aimed Command class provided by `cliPath` and assigns its value to the property
 *
 * @param cliPath chain of command class names until the desired class instance
 */
export function Aggregation(cliPath: string[]): PropertyDecorator {
  return Reflect.metadata(aggregationMetadataKey, cliPath);
}

/**
 * Get the aggregation metadata on the given property
 *
 * @param target Command instance
 * @param propertyKey Property of the command instance
 *
 * @returns CLI path of the aggregated relation
 */
export function getAggregation<T extends Command, K extends Extract<keyof T, string>>(target: T, propertyKey: K): string[] {
  return Reflect.getMetadata(aggregationMetadataKey, target, propertyKey);
}

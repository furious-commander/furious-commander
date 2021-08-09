import { Command } from './command'

const aggregationMetadataKey = Symbol('Aggregation')

export interface AggregationData {
  command: string
  property: string
}

export function findFirstAggregration(command: Command): AggregationData | null {
  // eslint-disable-next-line guard-for-in
  for (const key in command) {
    const aggregation = getAggregation(command, key as 'name')

    if (aggregation) {
      return {
        command: aggregation.join(' '),
        property: key,
      }
    }
  }

  return null
}

/**
 * Aggregate the aimed Command class provided by `cliPath` and assigns its value to the property
 *
 * @param cliPath chain of command class names until the desired class instance
 */
export function Aggregation(cliPath: string[]): PropertyDecorator {
  return Reflect.metadata(aggregationMetadataKey, cliPath)
}

/**
 * Get the aggregation metadata on the given property
 *
 * @param target Command instance
 * @param propertyKey Property of the command instance
 *
 * @returns CLI path of the aggregated relation
 */
export function getAggregation<T extends Command, K extends Extract<keyof T, string>>(
  target: T,
  propertyKey: K,
): string[] {
  return Reflect.getMetadata(aggregationMetadataKey, target, propertyKey)
}

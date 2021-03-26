interface BaseCommand {
  readonly name: string
  readonly description: string
  readonly aliases?: string[]
}

/**
 * Groups several LeafCommands
 */
export interface GroupCommand extends BaseCommand {
  subCommandClasses: { new(): Command }[]
}

/**
 * CLI Command Classes, which actually do something important
 */
export interface LeafCommand extends BaseCommand {
  run(): void | Promise<void>
}

/**
 * Defines the Command classes can implement either Subcommand or GroupCommand
 */
export type Command = LeafCommand | GroupCommand

export type InitedCommand = {
  command: Command
  subCommands: InitedCommand[]
}

export function isGroupCommand(command: Command): command is GroupCommand {
  return Boolean((command as GroupCommand).subCommandClasses)
}

export function isLeafCommand(command: Command): command is LeafCommand {
  return Boolean((command as LeafCommand).run)
}

const eitherOneParamMetadataKey = Symbol("eitherOneParam");

/**
 * It allows only one parameter to use from the given parameters keys (even one of it is required)
 *
 * @param parameterKeys Array of argument/option names which have conflict
 */
export function EitherOneParam<T extends { new(): BaseCommand }>(parameterKeys: string[]): ClassDecorator {
  return (target) => {
    const constructorTarget: T = target as unknown as T
    let eitherOneParamArray: string[][] | undefined = getEitherOneParam(constructorTarget);

    if(!eitherOneParamArray) eitherOneParamArray = []

    eitherOneParamArray.push(parameterKeys)

    Reflect.defineMetadata(eitherOneParamMetadataKey, eitherOneParamArray, target)
  };
}

/**
 * Get the array of group of argument/command/option names which have conflicts
 *
 * @param target Command instance
 */
export function getEitherOneParam<T extends { new(): BaseCommand }>(target: T): string[][] {
  return Reflect.getMetadata(eitherOneParamMetadataKey, target);
}

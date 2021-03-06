import initYargs from 'yargs/yargs'
import { Argv } from 'yargs'
import "reflect-metadata";
import { isGroupCommand, Command, GroupCommand, LeafCommand, InitedCommand } from './command'
import { IOption, getOption, Option, getExternalOption, ExternalOption } from './option'
import { IArgument, getArgument, Argument } from './argument';
import { getCommandInstance } from './utils'
import { getAggregation, Aggregation } from './aggregation';

/** native yargs object */
let yargs = initYargs(process.argv.slice(2))

interface ICli {
  /**
   * Array of the **Root** Command Classes
   */
  rootCommandClasses: { new(): Command }[]
  /**
   * Array of the **Root** opions of the CLI
   */
  optionParameters?: IOption[]
  /**
   * test arguments in order to testing the CLI's behaviour
   */
  testArguments?: Array<string>
}

interface CommandDecoratorData {
  commandOptions: IOption[]
  commandArguments: IArgument[]
}

interface CommandDecoratorDataWithAggregations extends CommandDecoratorData {
  commandAggregationRelations: string[][]
}

function applyOption(option: IOption) {
  const { key, describe, alias, type = 'string', required, default: defaultValue, choices, coerce, conflicts,implies, config, defaultDescription, deprecated, group, hidden, nargs } = option
  yargs.option(key, { alias, describe, type, demandOption: required, default: defaultValue, choices, coerce, conflicts,implies,  config, defaultDescription, deprecated, group, hidden, nargs })
}

/**
 * Fetches the given instance Argument, Option and Aggregation configs
 *
 * @param target Command instance
 * @returns all decorated metadata of the Command instance
 */
function getCommandDecoratorData<T extends Command>(target: T): CommandDecoratorDataWithAggregations {
  const commandOptions: IOption[] = []
  const commandArguments: IArgument[] = []
  const commandAggregationRelations: string[][] = []
  // eslint-disable-next-line guard-for-in
  for(const instanceKey in target) {
    const option = getOption(target, instanceKey)

    if(option) {
      commandOptions.push(option)

      continue
    }

    const argument = getArgument(target, instanceKey)

    if(argument) {
      commandArguments.push(argument)
    }

    const aggregation = getAggregation(target, instanceKey)

    if(aggregation) {
      commandAggregationRelations.push(aggregation)
    }
  }

  return {
    commandOptions,
    commandArguments,
    commandAggregationRelations,
  }
}

/**
 * Recursive regard of aggregated relation of the starting command
 * resolves aggregated relations
 * yargs decorators
 *
 * @return
 */
function getCommandDecoratorFields<T extends Command>(target: T, initedCommands: InitedCommand[], allDecoratorData: CommandDecoratorData) {
  const commandDecoratorData = getCommandDecoratorData(target);
  // add fetched decorator data to the total
  allDecoratorData.commandArguments.push(...commandDecoratorData.commandArguments)
  allDecoratorData.commandOptions.push(...commandDecoratorData.commandOptions)
  for(const aggregatedRelationPath of commandDecoratorData.commandAggregationRelations) {
    const aggregatedCommandInstance = getCommandInstance(initedCommands, aggregatedRelationPath)
    getCommandDecoratorFields(aggregatedCommandInstance, initedCommands, allDecoratorData)
  }
}

/**
 * Assigns the required CLI argument and option values to the given Command instance
 *
 * @param target Command instance
 * @param options CLI arguments which was mapped to this map object by yargs
 * @param initedCommands in order to get back the aggregated relation instance
 */
function initCommandFields<T extends Command>(target: T, options: { [key: string]: unknown }, initedCommands: InitedCommand[]) {
  // eslint-disable-next-line guard-for-in
  for(const instanceKey in target) {
    const option = getOption(target, instanceKey)

    if(option) {
      const { key } = option;

      if(options[key]) target[instanceKey] = options[key] as T[Extract<keyof T, string>]

      continue
    }

    const externalOptionKey = getExternalOption(target, instanceKey)

    if(externalOptionKey) {
      if(options[externalOptionKey]) target[instanceKey] = options[externalOptionKey] as T[Extract<keyof T, string>]

      continue
    }

    const argument = getArgument(target, instanceKey)

    if(argument) {
      const { key } = argument;

      if(options[key]) target[instanceKey] = options[key] as T[Extract<keyof T, string>]

      continue
    }

    const aggregatedRelationCliPath = getAggregation(target, instanceKey)

    if(aggregatedRelationCliPath) {
      const aggregatedCommandInstance = getCommandInstance(initedCommands, aggregatedRelationCliPath)

      if(!aggregatedCommandInstance) throw new Error(`Does not have available Command with CLI path: ${aggregatedRelationCliPath}`)
      // recursive set all aggregated relations' feild
      initCommandFields(aggregatedCommandInstance, options, initedCommands)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      target[instanceKey] = aggregatedCommandInstance as any
    }
  }
}

class CommandBuilder {
  /**
   * Used for tests as well
   */
  public initedCommands: InitedCommand[]

  public constructor(commandClasses: { new(): Command }[]) {
    this.initedCommands =  []

    yargs.demandCommand(1, 'You need at least one command before moving on')

    this.initCommandClasses(commandClasses)
  }

  private initCommandClasses(commands: { new(): Command }[]) {
    for(const CommandClass of commands) {
      this.initedCommands.push(this.initCommandClass(CommandClass))
    }

    for(const initedCommand of this.initedCommands) {
      // if(process.argv.slice(2).includes(initedCommand.command.name)) {
        this.initCommandClassYargs(initedCommand)
      // }
    }
  }

  private initCommandClassYargs(initedCommand: InitedCommand): Argv {
    const commandInstance = initedCommand.command
    const commandArguments: IArgument[] = []
    const commandOptions: IOption[] = []
    getCommandDecoratorFields(commandInstance, this.initedCommands, { //only for aggregation
      commandArguments,
      commandOptions,
    })
    //All aggregatedArguments
    let commandString = `${commandInstance.name}`
    //commandString build based on command class arguments
    const requiredArgumentSigns = ['<', '>']
    const optionalArgumentSigns = ['[', ']']
    commandArguments
      .sort((a, b) => {
        if(a.required) {
          if(b.required) return 0

          return 1
        } else if(b.required) return -1

        return 0
      })
      .forEach(argument => {
        const { key, required } =  argument
        const argumentSigns = required ? requiredArgumentSigns : optionalArgumentSigns
        commandString += ` ${argumentSigns[0]}${key}${argumentSigns[1]}`
      })

    return yargs.command({
      command: commandString,
      builder: () => {
        //handle command's options
        for(const option of commandOptions) {
          applyOption(option)
        }

        //handle command's arguments
        for(const argument of commandArguments) {
          const { key, required,  default: defaultValue, alias, array, choices, coerce, conflicts, desc, describe, implies, normalize, type } = argument
          yargs.positional(key, { demandOption: required, default: defaultValue, alias, array, choices, coerce, conflicts, desc, describe, implies, normalize, type })
        }

        if(!isGroupCommand(commandInstance)) return yargs;

        let subCommandArgs: Argv = yargs
        for(const subCommandInstance of initedCommand.subCommands) {
          subCommandArgs = this.initCommandClassYargs(subCommandInstance)
            .demandCommand(1, 'You need to add one subcommand that listed above')
        }

        return subCommandArgs
      },
      handler: async (args) => {
        initCommandFields(initedCommand.command, args, this.initedCommands);

        if(!isGroupCommand(commandInstance)) {
          await commandInstance.run()
        }
      },
      aliases: commandInstance.aliases,
      describe: `- ${commandInstance.description}`,
    })
  }

  private initCommandClass(CommandClass: {new(): Command}): InitedCommand {
    const command: Command = new CommandClass();
    const subCommands: InitedCommand[] = []

    if(isGroupCommand(command)) {
      const subCommandClasses = command.subCommandClasses
      for(const LeafCommandClass of subCommandClasses) {
        const subCommandClass = this.initCommandClass(LeafCommandClass)
        subCommands.push(subCommandClass)
      }
    }

    return { command, subCommands }
  }
}

/**
 * Initialize all command classes from the given roots
 *
 * @param options Initialization parameters for the CLI
 */
export function cli(options: ICli): Promise<CommandBuilder> {
  const { rootCommandClasses, optionParameters } = options

  if(options.testArguments) {
    yargs = initYargs()
    yargs.parse(options.testArguments)
    yargs.exitProcess(false)
  }

  yargs
  .strict()

  if(optionParameters) optionParameters.forEach(applyOption)

  const commandBuilder = new CommandBuilder(rootCommandClasses)

  return new Promise(resolve => {
    const _ = yargs.onFinishCommand(() => {
      resolve(commandBuilder)
    }).argv
  })
}

export {
  GroupCommand,
  LeafCommand,
  Argument,
  ExternalOption,
  Option,
  Aggregation,
  Command,
  InitedCommand,
}

export const Utils = {
  isGroupCommand,
  yargs,
  getCommandInstance,
}
export default cli;

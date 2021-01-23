import initYargs from 'yargs/yargs'
import { Argv } from 'yargs'
import "reflect-metadata";
import { isGroupCommand, Command, GroupCommand, LeafCommand } from './command'
import { IOption, getOption, Option, getExternalOption, ExternalOption } from './option'
import { IArgument, getArgument, Argument } from './argument';

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

export type InitedCommand = {
  command: Command
  subCommands: InitedCommand[]
}

function applyOption(option: IOption) {
  const { key, describe, alias, type = 'string', demandOption, default: defaultValue } = option
  yargs.option(key, { alias, describe, type, demandOption, default: defaultValue })
}

/**
 * Fetches the given instance Argument and Option configs
 *
 * @param target Command instance
 */
function getCommandArgumentAndOptionConfig<T extends Command>(target: T): { commandOptions: IOption[], commandArguments: IArgument[]} {
  const commandOptions: IOption[] = []
  const commandArguments: IArgument[] = []
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
  }

  return {
    commandOptions,
    commandArguments,
  }
}

/**
 * Assigns the required CLI argument and option values to the given Command instance
 *
 * @param target Command instance
 * @param options CLI arguments which was mapped to this map object by yargs
 */
function setCommandArguments<T extends Command>(target: T, options: { [key: string]: unknown }) {
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
      this.initCommandClassYargs(initedCommand)
    }

    // const _ = yargs.argv
  }

  private initCommandClassYargs(initedCommand: InitedCommand): Argv {
    const commandInstance = initedCommand.command
    const commandOptionAndArgumentConfig = getCommandArgumentAndOptionConfig(commandInstance);
    let commandString = `${commandInstance.name}`
    //commandString build based on command class arguments
    const requiredArgumentSigns = ['<', '>']
    const optionalArgumentSigns = ['[', ']']
    commandOptionAndArgumentConfig.commandArguments
      .sort((a, b) => {
        if(a.demandOption) {
          if(b.demandOption) return 0

          return 1
        } else if(b.demandOption) return -1

        return 0
      })
      .forEach(argument => {
        const { key, demandOption } =  argument
        const argumentSigns = demandOption ? requiredArgumentSigns : optionalArgumentSigns
        commandString += ` ${argumentSigns[0]}${key}${argumentSigns[1]}`
      })

    return yargs.command({
      command: commandString,
      builder: () => {
        //handle command's options
        for(const option of commandOptionAndArgumentConfig.commandOptions) {
          applyOption(option)
        }

        //handle command's arguments
        for(const argument of commandOptionAndArgumentConfig.commandArguments) {
          const { key, demandOption,  default: defaultValue, alias, array, choices, coerce, conflicts, desc, describe, implies, normalize, type } = argument
          yargs.positional(key, { demandOption, default: defaultValue, alias, array, choices, coerce, conflicts, desc, describe, implies, normalize, type })
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
        setCommandArguments(initedCommand.command, args);

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

export { GroupCommand, LeafCommand, Argument, ExternalOption, Option }
export default cli;

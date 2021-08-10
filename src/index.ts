import * as Fury from 'fury'
import { GroupCommand, LeafCommand } from 'fury'
import 'reflect-metadata'
import { Aggregation, AggregationData, findFirstAggregration } from './aggregation'
import { Application } from './application'
import { Argument, getArgument } from './argument'
import { addAutocompleteCapabilities, maybeAutocomplete } from './autocomplete'
import { Command, InitedCommand, isGroupCommand } from './command'
import { ExternalOption, getExternalOption, getOption, Option } from './option'
import { createDefaultPrinter, Printer } from './printer'

type Sourcemap = Record<string, 'default' | 'env' | 'explicit'>

let sourcemap: Sourcemap = {}

interface ICli {
  /**
   * Array of the **Root** Command Classes
   */
  rootCommandClasses: Fury.CommandConstructor[]
  /**
   * Array of the **Root** options of the CLI
   */
  optionParameters?: Fury.Argument<unknown>[]
  /**
   * test arguments in order to testing the CLI's behaviour
   */
  testArguments?: Array<string>
  /**
   * Functions used to print messages to the CLI
   */
  printer?: Printer
  /**
   * Application metadata for printing customised messages
   */
  application?: Application
}

interface CommandDecoratorData {
  commandOptions: Fury.Argument[]
  commandArguments: Fury.Argument[]
}

/**
 * Fetches the given instance Argument, Option and Aggregation configs
 *
 * @param target Command instance
 * @returns all decorated metadata of the Command instance
 */
function getCommandDecoratorData<T extends Command>(target: T): CommandDecoratorData {
  const commandOptions: Fury.Argument[] = []
  const commandArguments: Fury.Argument[] = []
  // eslint-disable-next-line guard-for-in
  for (const instanceKey in target) {
    const option = getOption(target, instanceKey)

    if (option) {
      commandOptions.push(option)
      continue
    }

    const argument = getArgument(target, instanceKey)

    if (argument) {
      commandArguments.push(argument)
      continue
    }
  }

  return {
    commandOptions,
    commandArguments,
  }
}

/**
 * Recursive regard of aggregated relation of the starting command
 * resolves aggregated relations
 *
 * @return
 */
function getCommandDecoratorFields<T extends Command>(target: T, allDecoratorData: CommandDecoratorData) {
  const commandDecoratorData = getCommandDecoratorData(target)
  // add fetched decorator data to the total
  allDecoratorData.commandArguments.push(...commandDecoratorData.commandArguments)
  allDecoratorData.commandOptions.push(...commandDecoratorData.commandOptions)
}

/**
 * Assigns the required CLI argument and option values to the given Command instance
 *
 * @param target Command instance
 * @param options CLI arguments which was mapped to this map object by yargs
 */
function initCommandFields<T extends LeafCommand>(target: T, options: Record<string, unknown>) {
  // eslint-disable-next-line guard-for-in
  for (const field in target) {
    const key = findKey(target, field)

    if (key) {
      Reflect.set(target, field, options[key])
    }
  }
}

function findKey<T extends LeafCommand, K extends Extract<keyof T, string>>(target: T, key: K): string | null {
  return getOption(target, key)?.key || getExternalOption(target, key) || getArgument(target, key)?.key
}

class CommandBuilder {
  /**
   * Used for tests as well
   */
  public initedCommands: InitedCommand[]
  public runnable?: LeafCommand
  public parser: Fury.Parser
  public context!: Fury.Context | string | { exitReason: string }

  public constructor(parser: Fury.Parser) {
    this.parser = parser
    this.initedCommands = []
  }

  public async initCommandClasses(argv: string[], rootCommandClasses: Fury.CommandConstructor[]): Promise<void> {
    this.initedCommands = rootCommandClasses.map(x => this.instantiateCommandTree(x))
    this.initedCommands.forEach(x => this.declareCommand(this.parser, x))

    await maybeAutocomplete(argv, this.parser)

    this.context = await this.parser.parse(argv)

    if (typeof this.context === 'string' || 'exitReason' in this.context) {
      return
    }

    if (!this.context.command) {
      return
    }

    sourcemap = this.context.sourcemap

    const command = this.context.command.leafCommand

    initCommandFields(command, {
      ...this.context.options,
      ...this.context.arguments,
    })

    if (this.context.sibling) {
      const sibling = findFirstAggregration(command) as AggregationData
      const siblingCommand = this.context.sibling.command.leafCommand
      Reflect.set(command, sibling.property, siblingCommand)
      initCommandFields(siblingCommand, {
        ...this.context.sibling.options,
        ...this.context.sibling.arguments,
      })
    }

    this.runnable = this.context.command.leafCommand
  }

  private createGroup(
    command: GroupCommand,
    commandArguments: Fury.Argument[],
    commandOptions: Fury.Argument[],
  ): Fury.Group {
    const group = new Fury.Group(command.name, command.description)
    getCommandDecoratorFields(command, {
      commandArguments,
      commandOptions,
    })
    for (const subcommandClass of command.subCommandClasses) {
      const initedSubcommand = new subcommandClass()

      if (isGroupCommand(initedSubcommand)) {
        const childGroup = this.createGroup(initedSubcommand, [...commandArguments], [...commandOptions])
        group.withGroup(childGroup)
      } else {
        const command = this.createCommand(initedSubcommand, [...commandOptions], [...commandArguments])
        group.withCommand(command)
      }
    }

    return group
  }

  private declareCommand(parser: Fury.Parser, initedCommand: InitedCommand): void {
    const commandInstance = initedCommand.command

    if (isGroupCommand(commandInstance)) {
      const group = this.createGroup(commandInstance, [], [])
      parser.addGroup(group)
    } else {
      const command = this.createCommand(commandInstance, [], [])
      parser.addCommand(command)
    }
  }

  private instantiateCommandTree(commandClass: Fury.CommandConstructor): InitedCommand {
    const command = new commandClass()
    const subCommands = isGroupCommand(command) ? this.instantiateSubcommands(command) : []

    return { command, subCommands }
  }

  private instantiateSubcommands(instance: GroupCommand): InitedCommand[] {
    const subCommandClasses = instance.subCommandClasses

    return subCommandClasses.map(x => this.instantiateCommandTree(x))
  }

  private createCommand(
    command: LeafCommand,
    commandOptions: Fury.Argument[],
    commandArguments: Fury.Argument[],
  ): Fury.Command {
    getCommandDecoratorFields(command, {
      commandArguments,
      commandOptions,
    })
    const aggregation = findFirstAggregration(command)
    const commandDefinition = new Fury.Command(command.name, command.description, command, {
      sibling: aggregation?.command,
      alias: command.alias,
    })
    for (const option of commandOptions) {
      commandDefinition.withOption(option)
    }
    for (const argument of commandArguments) {
      commandDefinition.withPositional(argument)
    }

    return commandDefinition
  }
}

/**
 * Initialize all command classes from the given roots
 *
 * @param options Initialization parameters for the CLI
 */
export async function cli(options: ICli): Promise<CommandBuilder> {
  const { rootCommandClasses, optionParameters, testArguments, application } = options
  const printer = options.printer || createDefaultPrinter()
  const parser = Fury.createParser({ printer, application })

  if (application) {
    addAutocompleteCapabilities(parser, application)
  }

  if (optionParameters) {
    for (const option of optionParameters) {
      parser.addGlobalOption(option)
    }
  }
  const builder = new CommandBuilder(parser)
  await builder.initCommandClasses(testArguments || process.argv.slice(2), rootCommandClasses)

  if (builder.runnable) {
    try {
      await builder.runnable.run()
    } catch (error) {
      printer.printHeading(printer.formatImportant(printer.getGenericErrorMessage()))
      printer.print('')
      printer.printError(error.message)
    }
  }

  return builder
}

export { GroupCommand, LeafCommand, Argument, ExternalOption, Option, Aggregation, Command, InitedCommand, Sourcemap }

export type IOption<T = unknown> = Fury.Argument<T>
export type IArgument<T = unknown> = Fury.Argument<T>

export const Utils = {
  isGroupCommand,
  getSourcemap: (): Sourcemap => sourcemap,
}
export default cli

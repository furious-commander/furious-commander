/**
 * Defines the Command classes can implement either Subcommand or GroupCommand
 */
export type Command = LeafCommand | GroupCommand

export type CommandConstructor = { new (): Command }

interface BaseCommand {
  readonly name: string
  readonly description: string
  readonly alias?: string
}

/**
 * Groups several LeafCommands
 */
export interface GroupCommand extends BaseCommand {
  subCommandClasses: CommandConstructor[]
}

/**
 * CLI Command Classes, which actually do something important
 */
export interface LeafCommand extends BaseCommand {
  run(): void | Promise<void>
}

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

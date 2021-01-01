interface BaseCommand {
  readonly name: string
  readonly description: string
  readonly aliases?: string[]
}

/**
 * Groups several SubCommands
 */
export interface GroupCommand extends BaseCommand {
  subCommandClasses: { new(): Command }[]
}

/**
 * CLI Command Classes, which actually do something important
 */
export interface SubCommand extends BaseCommand {
  run(): void
}

/**
 * Defines the Command classes can implement either Subcommand or GroupCommand
 */
export type Command = SubCommand | GroupCommand

export function isGroupCommand(command: Command): command is GroupCommand {
  return Boolean((command as GroupCommand).subCommandClasses)
}

export function isSubCommand(command: Command): command is SubCommand {
  return Boolean((command as SubCommand).run)
}

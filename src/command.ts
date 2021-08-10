import { GroupCommand, LeafCommand } from 'fury'

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

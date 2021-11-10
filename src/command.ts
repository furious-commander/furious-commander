import { GroupCommand, LeafCommand } from 'madlad'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Command = (LeafCommand & Partial<{ [key: string]: any }>) | (GroupCommand & Partial<{ [key: string]: any }>)

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

import { Argument, Command, Group } from './type'

export interface CommandDefinition {
  key: string
  fullPath: string
  description: string
  options: Argument[]
  arguments: Argument[]
  alias?: string
  sibling?: string
}

export type ParsedCommand = { command: Command; arguments: Record<string, unknown>; options: Record<string, unknown> }

export interface Context {
  exitReason?: string
  command?: Command | undefined
  group?: Group | undefined
  options: Record<string, unknown>
  arguments: Record<string, unknown>
  sourcemap: Record<string, 'default' | 'env' | 'explicit'>
  sibling?: ParsedCommand
  argumentIndex: number
}

export type ParsedContext = Context & { command: Command }

export interface Application {
  name: string
  command: string
  version: string
  description: string
}

export interface Parser {
  suggest(line: string, offset: number, trailing: string): Promise<string[]>
  parse(argv: string[]): Promise<string | Context | { exitReason: string }>
  addGroup(group: Group): void
  addCommand(command: Command): void
  addGlobalOption(option: Argument): void
}

export interface ParserOptions {
  printer?: Printer
  application?: Application
  pathResolver?: (word: string) => Promise<string[]>
}

export type Shell = 'fish' | 'zsh' | 'bash'

export interface Printer {
  print(text: string): void
  printError(text: string): void
  printHeading(text: string): void
  formatDim(text: string): string
  formatImportant(text: string): string
}

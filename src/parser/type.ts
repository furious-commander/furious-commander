import { LeafCommand } from '../command'

export interface Argument<T = unknown> {
  key: string
  description: string
  type?: 'string' | 'boolean' | 'number' | 'bigint' | 'hex-string'
  required?: boolean | { when: string } | { unless: string }
  conflicts?: string
  default?: T
  defaultDescription?: string
  alias?: string
  envKey?: string
  minimum?: number | bigint
  maximum?: number | bigint
  length?: number
  minimumLength?: number
  maximumLength?: number
  oddLength?: boolean
  noErrors?: boolean
  autocompletePath?: boolean
  handler?: () => void
  global?: boolean
}

function prependName(group: Group, name: string) {
  group.fullPath = name + ' ' + group.fullPath
  group.depth++
  for (const child of group.groups) {
    prependName(child, name)
  }
  for (const child of group.commands) {
    child.depth++
    child.fullPath = name + ' ' + child.fullPath
  }
}

export class Group {
  public key: string
  public description: string
  public groups: Group[]
  public commands: Command[]
  public fullPath: string
  public depth: number

  constructor(key: string, description: string) {
    this.key = key
    this.description = description
    this.groups = []
    this.commands = []
    this.fullPath = key
    this.depth = 0
  }

  public withGroup(group: Group): Group {
    this.groups.push(group)
    prependName(group, this.fullPath)

    return this
  }
  public withCommand(command: Command): Group {
    this.commands.push(command)
    command.depth++
    command.fullPath = this.key + ' ' + command.fullPath

    return this
  }
}

export class Command {
  public key: string
  public description: string
  public sibling?: string
  public alias?: string
  public options: Argument[]
  public arguments: Argument[]
  public fullPath: string
  public depth: number
  public leafCommand: LeafCommand

  constructor(
    key: string,
    description: string,
    leafCommand: LeafCommand,
    settings?: { sibling?: string; alias?: string },
  ) {
    this.key = key
    this.description = description
    this.leafCommand = leafCommand

    if (settings) {
      this.sibling = settings.sibling
      this.alias = settings.alias
    }
    this.options = []
    this.arguments = []
    this.fullPath = key
    this.depth = 0
  }

  withOption(x: Argument): Command {
    this.options.push(x)

    return this
  }

  withPositional(x: Argument): Command {
    this.arguments.push(x)

    return this
  }
}

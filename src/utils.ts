import { Command, InitedCommand } from './command'

/**
 * Gives back the command instance of the last given parameter
 *
 * @param initedCommands InitedCommand array which are the root commands classes of the CLI
 * @param commandNames chain of command class names until the desired class instance
 *
 * @returns command instance which corresponding to the last given classname parameter
 */
export function getCommandInstance(initedCommands: InitedCommand[], commandNames: string[]): Command {
  if (commandNames.length === 0) throw new Error('There is no commandName parameter passing on the function')
  const commandName = commandNames[0]
  commandNames = commandNames.slice(1)

  for (const initedCommand of initedCommands) {
    if (commandName === initedCommand.command.name) {
      if (commandNames.length > 0) {
        return getCommandInstance(initedCommand.subCommands, commandNames)
      } else {
        return initedCommand.command
      }
    }
  }

  throw new Error(`Command instance with name '${commandName}' has not found`)
}

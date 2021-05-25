import * as Argv from 'cafe-args'
import omelette from 'omelette'
import { exit } from 'process'

export function autocomplete(parser: Argv.Parser, command: string): Promise<void> {
  return new Promise(resolve => {
    const completion = omelette(command)

    completion.on('complete', (fragment, { line, reply }) => {
      const relevantPart = line.slice(command.length + 1)
      reply(parser.suggest(relevantPart))
    })

    completion.next(() => {
      resolve()
    })

    completion.init()

    if (process.argv.includes('--install-autocomplete')) {
      completion.setupShellInitFile()
      exit(0)
    }
  })
}

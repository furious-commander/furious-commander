import { Context } from 'vm'
import { tokenize } from './tokenize'
import { Argument, Command, Group } from './type'

type NodeWithMeta = (Group | Command) & { matchingPartLength: number }

function getSiblingOptions(name: string, entries: (Command | Group)[]) {
  const item = entries.find(entry => entry.fullPath === name)

  if (item && 'options' in item) {
    return item.options
  }
}

function getSiblingArguments(name: string, entries: (Command | Group)[]) {
  const item = entries.find(entry => entry.fullPath === name)

  if (item && 'arguments' in item) {
    return item.arguments
  }
}

function isOptionSpecified(context: Context, option: Argument) {
  if (context.argv.includes('--' + option.key) && context.token !== '--' + option.key) {
    return true
  }

  if (option.alias && context.argv.includes('-' + option.alias) && context.token !== '-' + option.alias) {
    return true
  }

  return false
}

function findMatchingOptions(context: Context, options: Argument[]) {
  if (['', '-', '--'].includes(context.token)) {
    return options.map(option => '--' + option.key)
  }

  if (context.token.startsWith('--')) {
    return options.filter(option => option.key.startsWith(context.token.slice(2))).map(option => '--' + option.key)
  } else if (context.token.startsWith('-')) {
    return options
      .filter(option => option.alias && option.alias.startsWith(context.token.slice(1)))
      .map(option => '-' + option.alias)
  }

  return []
}

function selectLongerMatchingPartNode(a: NodeWithMeta, b: NodeWithMeta): NodeWithMeta {
  return a.matchingPartLength > b.matchingPartLength ? a : b
}

function selectLowestDepthNode(a: NodeWithMeta, b: NodeWithMeta): NodeWithMeta {
  return a.depth < b.depth ? a : b
}

function getMatchingPartLength(a: string, b: string) {
  const length = a.length < b.length ? a.length : b.length
  let i = 0
  for (; i < length; i++) {
    if (a[i] !== b[i]) {
      break
    }
  }

  return i
}

function flatten(results: (Command | Group)[], node: Command | Group) {
  results.push(node)

  if ('groups' in node) {
    node.groups.forEach(group => flatten(results, group))
  }

  if ('commands' in node) {
    node.commands.forEach(command => flatten(results, command))
  }
}

function findOptionForWord(word: string, options: Argument[]) {
  if (word.startsWith('--')) {
    return options.find(option => option.key === word.slice(2))
  } else if (word.startsWith('-')) {
    return options.find(option => option.alias === word.slice(1))
  }

  return null
}

function getPreviousOption(context: Context, options: Argument[]) {
  const word = context.opensNext ? context.argv[context.argv.length - 1] : context.argv[context.argv.length - 2]

  return findOptionForWord(word, options)
}

function isBooleanTrueLike(word: string) {
  return word && word.length && 'true'.startsWith(word)
}

function isBooleanFalseLike(word: string) {
  return word && word.length && 'false'.startsWith(word)
}

function getPositionalArgument(
  command: Command,
  context: Context,
  allArguments: Argument[],
  globalOptions: Argument[],
) {
  if (!allArguments.length) {
    return null
  }
  const commandWords = command.fullPath.split(' ').length

  if (commandWords === context.argv.length && context.opensNext) {
    return allArguments[0]
  }
  let argumentIndex = -1
  for (let i = commandWords; i < context.argv.length; i++) {
    const word = context.argv[i]
    const next = context.argv[i + 1]
    const option = findOptionForWord(word, globalOptions)

    if (option) {
      if (option.type === 'boolean') {
        if (isBooleanTrueLike(next) || isBooleanFalseLike(next)) {
          i++
          continue
        }
      } else {
        i++
        continue
      }
    } else {
      argumentIndex++
    }
  }

  if (context.opensNext) {
    argumentIndex++
  }

  return Object.values(allArguments)[argumentIndex]
}

function handleMatch(
  context: Context,
  match: Command | Group,
  entries: (Command | Group)[],
  globalOptions: Argument[],
  pathResolver: (string: string) => Promise<string[]>,
) {
  const options = [
    ...('options' in match ? match.options : []),
    ...('sibling' in match && match.sibling ? (getSiblingOptions(match.sibling, entries) as Argument[]) : []),
    ...globalOptions,
  ]
  const allArguments = [
    ...('arguments' in match ? match.arguments : []),
    ...('sibling' in match && match.sibling ? (getSiblingArguments(match.sibling, entries) as Argument[]) : []),
  ]
  const previousOption = getPreviousOption(context, options)

  if (previousOption && previousOption.type === 'boolean' && context.token) {
    if (isBooleanTrueLike(context.token)) {
      return ['true']
    }

    if (isBooleanFalseLike(context.token)) {
      return ['false']
    }
  }

  if (previousOption && previousOption.autocompletePath) {
    return pathResolver(context.token)
  }

  if (!context.token.startsWith('-')) {
    const positionalArgument = getPositionalArgument(match as Command, context, allArguments, globalOptions)

    if (positionalArgument && positionalArgument.autocompletePath) {
      return pathResolver(context.token)
    }
  }
  const missingOptions = options.filter(option => !isOptionSpecified(context, option))

  return findMatchingOptions(context, missingOptions)
}

function trail(suggestions: string[], trailing: string) {
  if (!trailing || !suggestions.length) {
    return suggestions
  }

  return suggestions.map(suggestion => (suggestion.endsWith('/') ? suggestion : suggestion + trailing))
}

export async function suggest(
  line: string,
  offset: number,
  entries: (Command | Group)[],
  globalOptions: Argument[],
  pathResolver: (string: string) => Promise<string[]>,
  trailing: string,
): Promise<string[]> {
  const context = tokenize(line, offset)

  if (!context.argv.length) {
    return trail(
      entries.filter(entry => entry.depth === 0).map(x => x.key),
      trailing,
    )
  }
  const normalLine = context.argv.join(' ') + (context.opensNext ? ' ' : '')
  const nodes: ((Group | Command) & { matchingPartLength: number })[] = []
  for (const entry of entries) {
    flatten(nodes, entry)
  }
  const match = nodes.find(node => normalLine.startsWith(node.fullPath + ' ') && 'options' in node)

  if (match) {
    return trail(await handleMatch(context, match, entries, globalOptions, pathResolver), trailing)
  }
  for (const node of nodes) {
    node.matchingPartLength = getMatchingPartLength(normalLine, node.fullPath)
  }
  const longestMatchingPartLength = nodes.reduce(selectLongerMatchingPartNode).matchingPartLength

  if (!longestMatchingPartLength) {
    return []
  }
  const substringMatches = nodes.filter(node => node.matchingPartLength === longestMatchingPartLength)
  const lowestDepth = substringMatches.reduce(selectLowestDepthNode).depth
  const matches = substringMatches.filter(node => node.depth === lowestDepth)

  return trail(
    matches.map(x => x.key),
    trailing,
  )
}

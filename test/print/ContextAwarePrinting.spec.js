const { createParser, Group, Command } = require('../../src/parser')

function containsItemWithSubstring(array, substring) {
  return array.some(item => item[0].includes(substring))
}

const parser = createParser()
parser.addGlobalOption({
  key: 'help',
  type: 'boolean',
})
parser.addGlobalOption({
  key: 'verbose',
  type: 'boolean',
})
parser.addGroup(
  new Group('random', 'Generate random values')
    .withCommand(
      new Command('bytes', 'Generate random bytes').withPositional({
        key: 'length',
        required: true,
        description: 'Number of bytes',
        type: 'number',
        minimum: 0,
      }),
    )
    .withCommand(new Command('number', 'Generate random number')),
)

it('should print group usage when groups are printed', () => {
  process.stdout.write = jest.fn()
  parser.parse([''])
  const calls = process.stdout.write.mock.calls
  expect(containsItemWithSubstring(calls, 'Available Groups')).toBe(true)
  expect(containsItemWithSubstring(calls, "Run 'node GROUP --help' to see available commands in a group")).toBe(true)
})

it('should print command usage when commands are printed', () => {
  process.stdout.write = jest.fn()
  parser.parse(['random'])
  const calls = process.stdout.write.mock.calls
  expect(containsItemWithSubstring(calls, 'Available Commands')).toBe(true)
  expect(containsItemWithSubstring(calls, "Run 'node COMMAND --help' for more information on a command")).toBe(true)
})

it('should print headline when invoking root', () => {
  process.stdout.write = jest.fn()
  parser.parse([''])
  const calls = process.stdout.write.mock.calls
  expect(containsItemWithSubstring(calls, 'Node.js CLI 1.0.0 - Powered by open source technologies')).toBe(true)
})

it('should not print error when invoking root', () => {
  process.stdout.write = jest.fn()
  parser.parse([''])
  const calls = process.stdout.write.mock.calls
  expect(containsItemWithSubstring(calls, 'failed')).toBe(false)
})

it('should not print error when invoking group', () => {
  process.stdout.write = jest.fn()
  parser.parse(['random'])
  const calls = process.stdout.write.mock.calls
  expect(containsItemWithSubstring(calls, 'failed')).toBe(false)
})

it('should print usage for commands with arguments', () => {
  process.stdout.write = jest.fn()
  parser.parse(['random', 'bytes', '--help'])
  const calls = process.stdout.write.mock.calls
  expect(containsItemWithSubstring(calls, 'Usage:')).toBe(true)
  expect(containsItemWithSubstring(calls, 'node random bytes <length> [OPTIONS]')).toBe(true)
})

it('should print usage for commands without arguments', () => {
  process.stdout.write = jest.fn()
  parser.parse(['random', 'number', '--help'])
  const calls = process.stdout.write.mock.calls
  expect(containsItemWithSubstring(calls, 'Usage:')).toBe(true)
  expect(containsItemWithSubstring(calls, 'node random number [OPTIONS]')).toBe(true)
})

it('should print general group usage for commands in group context', () => {
  process.stdout.write = jest.fn()
  parser.parse(['random', '--help'])
  const calls = process.stdout.write.mock.calls
  expect(containsItemWithSubstring(calls, 'Usage:')).toBe(true)
  expect(containsItemWithSubstring(calls, 'node random COMMAND [OPTIONS]')).toBe(true)
})

it('should print general usage for commands in root context', () => {
  process.stdout.write = jest.fn()
  parser.parse([''])
  const calls = process.stdout.write.mock.calls
  expect(containsItemWithSubstring(calls, 'Usage:')).toBe(true)
  expect(containsItemWithSubstring(calls, 'node COMMAND [OPTIONS]')).toBe(true)
})

it('should print usage for commands with arguments when invoked blank', () => {
  process.stdout.write = jest.fn()
  parser.parse(['random', 'bytes'])
  const calls = process.stdout.write.mock.calls
  expect(containsItemWithSubstring(calls, 'Usage:')).toBe(true)
  expect(containsItemWithSubstring(calls, 'node random bytes <length> [OPTIONS]')).toBe(true)
  expect(containsItemWithSubstring(calls, 'failed')).toBe(false)
})

it('should print usage for commands with arguments but also fail when not invoked blank', () => {
  process.stdout.write = jest.fn()
  parser.parse(['random', 'bytes', '--verbose'])
  const calls = process.stdout.write.mock.calls
  expect(containsItemWithSubstring(calls, 'Usage:')).toBe(true)
  expect(containsItemWithSubstring(calls, 'node random bytes <length> [OPTIONS]')).toBe(true)
  expect(containsItemWithSubstring(calls, 'failed')).toBe(true)
})

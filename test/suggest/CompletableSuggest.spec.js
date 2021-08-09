const { createParser, Command, Group } = require('../../src/parser')

const parser = createParser()
parser.addCommand(new Command('command', 'N/A'))
parser.addCommand(new Command('prefixed-command', 'N/A'))
parser.addGroup(new Group('group', 'N/A').withCommand(new Command('nested-command', 'N/A')))
parser.addGroup(new Group('prefixed-group', 'N/A').withCommand(new Command('prefixed-nested-command', 'N/A')))

it('should suggest single nested command', async () => {
  const suggestions = await parser.suggest('group ne')
  expect(suggestions).toHaveProperty('length', 1)
  expect(suggestions).toHaveProperty('0', 'nested-command')
})

it('should suggest single top level group', async () => {
  const suggestions = await parser.suggest('g')
  expect(suggestions).toHaveProperty('length', 1)
  expect(suggestions).toHaveProperty('0', 'group')
})

it('should suggest single top level command', async () => {
  const suggestions = await parser.suggest('comma')
  expect(suggestions).toHaveProperty('length', 1)
  expect(suggestions).toHaveProperty('0', 'command')
})

it('should suggest multiple items', async () => {
  const suggestions = await parser.suggest('pref')
  expect(suggestions).toHaveProperty('length', 2)
  expect(suggestions).toHaveProperty('0', 'prefixed-group')
  expect(suggestions).toHaveProperty('1', 'prefixed-command')
})

it('should suggest for exact match without trailing space', async () => {
  const suggestions = await parser.suggest('command')
  expect(suggestions).toHaveProperty('length', 1)
  expect(suggestions).toHaveProperty('0', 'command')
})

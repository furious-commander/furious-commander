const { createParser, Command, Group } = require('../../src/parser')

const parser = createParser()
parser.addGroup(new Group('group', 'N/A').withCommand(new Command('nested-command', 'N/A')))
parser.addCommand(new Command('command', 'N/A'))

it('should suggest root items', async () => {
  const suggestions = await parser.suggest('')
  expect(suggestions).toHaveProperty('length', 2)
  expect(suggestions).toHaveProperty('0', 'group')
  expect(suggestions).toHaveProperty('1', 'command')
})

it('should not suggest items that do not match', async () => {
  const suggestions = await parser.suggest('unknown')
  expect(suggestions).toHaveProperty('length', 0)
})

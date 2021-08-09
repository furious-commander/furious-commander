const { createParser, Group, Command } = require('../../src/parser')

const parser = createParser()
parser.addGroup(
  new Group('group', 'Test').withCommand(
    new Command('command', 'Test')
      .withPositional({ key: 'argument', description: 'Test', type: 'string', required: true })
      .withOption({ key: 'boolean', description: 'Test', type: 'boolean' }),
  ),
)

it('should allow argument after boolean and not consume it', async () => {
  const context = await parser.parse(['group', 'command', '--boolean', 'argument'])
  expect(context).toHaveProperty('group')
  expect(context).toHaveProperty('command')
  expect(context).toHaveProperty('options')
  expect(context).toHaveProperty('arguments')
  expect(context.group).toHaveProperty('key', 'group')
  expect(context.command).toHaveProperty('key', 'command')
  expect(context.options).toHaveProperty('boolean', true)
  expect(context.arguments).toHaveProperty('argument', 'argument')
})

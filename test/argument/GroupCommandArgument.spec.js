const { createParser, Group, Command } = require('../../src/parser')

const parser = createParser()
parser.addGroup(
  new Group('identity', 'Test').withCommand(
    new Command('export', 'Test').withPositional({
      key: 'argument',
      description: 'Test',
      type: 'string',
      required: true,
    }),
  ),
)

it('should allow passing arguments to group commands', async () => {
  const context = await parser.parse(['identity', 'export', 'main'])
  expect(context).toHaveProperty('group')
  expect(context).toHaveProperty('command')
  expect(context).toHaveProperty('arguments')
  expect(context.group).toHaveProperty('key', 'identity')
  expect(context.command).toHaveProperty('key', 'export')
  expect(context.arguments).toHaveProperty('argument', 'main')
})

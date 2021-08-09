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

it('should raise errors when not passing required argument to group commands', async () => {
  const context = await parser.parse(['identity', 'export'])
  expect(context).toBe('Required argument [argument] is not provided')
})

const { createParser, Command } = require('../../src/parser')

const parser = createParser()
parser.addCommand(
  new Command('upload', 'Test').withPositional({ key: 'path', description: 'Test', type: 'string', required: true }),
)

it('should raise errors when not passing required argument to top level commands', async () => {
  const context = await parser.parse(['upload'])
  expect(context).toBe('Required argument [path] is not provided')
})

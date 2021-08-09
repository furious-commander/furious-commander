const { createParser, Command } = require('../../src/parser')

const parser = createParser()
parser.addCommand(
  new Command('reverse', 'Test').withOption({ key: 'string', description: 'Test', type: 'string', required: true }),
)

it('should parse strings', async () => {
  const context = await parser.parse(['reverse', '--string', 'racecar'])
  expect(context).toHaveProperty('command')
  expect(context).toHaveProperty('options')
  expect(context.command).toHaveProperty('key', 'reverse')
  expect(context.options).toHaveProperty('string', 'racecar')
})

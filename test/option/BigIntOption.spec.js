const { createParser, Command } = require('../../src/parser')

const parser = createParser()
parser.addCommand(
  new Command('test', 'Test').withOption({ key: 'large', description: 'Test', type: 'bigint', required: true }),
)

it('should parse bigints', async () => {
  const context = await parser.parse(['test', '--large', '123456789012345678901234567890'])
  expect(context).toHaveProperty('command')
  expect(context).toHaveProperty('options')
  expect(context.options).toHaveProperty('large', 123456789012345678901234567890n)
})

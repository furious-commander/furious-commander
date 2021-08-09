const { createParser, Command } = require('../../src/parser')

const parser = createParser()
parser.addCommand(
  new Command('is-even', 'Test').withOption({ key: 'number', description: 'Test', type: 'number', required: true }),
)

it('should parse numbers', async () => {
  const context = await parser.parse(['is-even', '--number', '42'])
  expect(context).toHaveProperty('command')
  expect(context).toHaveProperty('options')
  expect(context.command).toHaveProperty('key', 'is-even')
  expect(context.options).toHaveProperty('number', 42)
})

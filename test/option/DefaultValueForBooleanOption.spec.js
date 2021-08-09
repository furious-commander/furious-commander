const { createParser, Command } = require('../../src/parser')

const parser = createParser()
parser.addCommand(
  new Command('test', 'Test').withOption({ key: 'boolean', description: 'Test', type: 'boolean', default: false }),
)

it('should set default false to a boolean', async () => {
  const context = await parser.parse(['test'])
  expect(context).toHaveProperty('options')
  expect(context.options).toHaveProperty('boolean', false)
})

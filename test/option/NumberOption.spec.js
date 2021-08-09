const { createParser, Command } = require('../../src/parser')

const parser = createParser()
parser.addCommand(
  new Command('accept-zero', 'Test').withOption({ key: 'number', description: 'Test', type: 'number', default: -1 }),
)

it('should be -1 by default', async () => {
  const context = await parser.parse(['accept-zero'])
  expect(context).toHaveProperty('options')
  expect(context.options).toHaveProperty('number', -1)
})

it('should be 0 when specified', async () => {
  const context = await parser.parse(['accept-zero', '--number', '0'])
  expect(context).toHaveProperty('options')
  expect(context.options).toHaveProperty('number', 0)
})

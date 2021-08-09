const { createParser, Command } = require('../../src/parser')

const parser = createParser()
parser.addCommand(new Command('su', 'Switch user').withOption({ key: 'user', required: true, noErrors: true }))

it('should not throw error for required option with noErrors', async () => {
  const context = await parser.parse(['su'])
  expect(context).toHaveProperty('options.su', undefined)
})

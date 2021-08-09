const { createParser, Command } = require('../../src/parser')

const parser = createParser()
parser.addCommand(new Command('su', 'Switch user').withPositional({ key: 'user', required: true, noErrors: true }))

it('should not throw error for required argument with noErrors', async () => {
  const context = await parser.parse(['su'])
  expect(context).toHaveProperty('arguments.su', undefined)
})

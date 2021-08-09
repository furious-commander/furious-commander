const { createParser, Command } = require('../../src/parser')

const parser = createParser()
parser.addCommand(
  new Command('no-arrays', 'Test').withOption({
    key: 'single',
    description: 'Test',
    type: 'number',
    required: true,
    alias: 'S',
  }),
)

it('should raise error when same option is specified multiple times', async () => {
  const context = await parser.parse(['no-arrays', '--single', '15', '--single', '14'])
  expect(context).toBe('Option passed more than once: single')
})

it('should raise error when same option is specified multiple times v2', async () => {
  const context = await parser.parse(['no-arrays', '--single', '10', '-S', '200'])
  expect(context).toBe('Option passed more than once: single')
})

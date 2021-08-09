const { createParser, Command } = require('../../src/parser')

const parser = createParser()
parser.addCommand(
  new Command('weather', 'Display weather info').withOption({
    key: 'verbosity',
    description: 'Verbosity 1=minimal 2=normal 3=verbose',
    type: 'number',
    required: false,
    minimum: 1,
    maximum: 3,
  }),
)

it('should raise error when number is above maximum', async () => {
  const context = await parser.parse(['weather', '--verbosity', '4'])
  expect(context).toBe('[verbosity] must be at most 3')
})

it('should allow number exactly the maximum', async () => {
  const context = await parser.parse(['weather', '--verbosity', '3'])
  expect(context).toHaveProperty('options')
  expect(context.options).toHaveProperty('verbosity', 3)
})

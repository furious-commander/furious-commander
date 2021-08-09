const { createParser, Command } = require('../../src/parser')

const parser = createParser()
parser.addCommand(
  new Command('abs', 'Print absolute value of number').withOption({
    key: 'value',
    description: 'The number',
    type: 'number',
  }),
)

it('should allow passing negative numbers as options', async () => {
  const context = await parser.parse(['abs', '--value', '-1'])
  expect(context).toHaveProperty('options')
  expect(context.options).toHaveProperty('value', -1)
})

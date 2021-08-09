const { createParser, Command } = require('../../src/parser')

const parser = createParser()
parser.addCommand(
  new Command('large-abs', 'Print absolute value of large number').withPositional({
    key: 'value',
    description: 'The large number',
    type: 'bigint',
  }),
)

it('should allow passing negative bigints as arguments', async () => {
  const context = await parser.parse(['large-abs', '-42000333000333'])
  expect(context).toHaveProperty('arguments')
  expect(context.arguments).toHaveProperty('value', -42000333000333n)
})

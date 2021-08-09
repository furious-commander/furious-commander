const { createParser, Command } = require('../../src/parser')

const parser = createParser()
parser.addCommand(
  new Command('large-abs', 'Print absolute value of large number').withOption({
    key: 'value',
    description: 'The large number',
    type: 'bigint',
  }),
)

it('should allow passing negative bigints as options', async () => {
  const context = await parser.parse(['large-abs', '--value', '-999000888000777000666000111000'])
  expect(context).toHaveProperty('options')
  expect(context.options).toHaveProperty('value', -999000888000777000666000111000n)
})

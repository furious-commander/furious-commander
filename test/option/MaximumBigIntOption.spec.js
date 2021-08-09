const { createParser, Command } = require('../../src/parser')

const parser = createParser()
parser.addCommand(
  new Command('bid', 'Bid to action')
    .withPositional({ key: 'auction-id', description: 'Auction ID', required: true })
    .withOption({
      key: 'value',
      description: 'Value in wei',
      type: 'bigint',
      required: true,
      minimum: 1,
      maximum: 1000000000000000000000n,
    }),
)

it('should raise error when bigint is above maximum', async () => {
  const context = await parser.parse(['bid', 'jY89ca', '--value', '1000000000000000000001'])
  expect(context).toBe('[value] must be at most 1000000000000000000000')
})

it('should allow bigint exactly the maximum', async () => {
  const context = await parser.parse(['bid', '0aVm3J', '--value', '1000000000000000000000'])
  expect(context).toHaveProperty('options')
  expect(context.options).toHaveProperty('value', 1000000000000000000000n)
})

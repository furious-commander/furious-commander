const { createParser, Command } = require('../../src/parser')

const parser = createParser()
parser.addCommand(
  new Command('buy')
    .withOption({ key: 'amount', type: 'number', required: true })
    .withOption({ key: 'price', type: 'bigint', required: true }),
)

it('should parse number and bigint options with underscore', async () => {
  const context = await parser.parse(['buy', '--amount', '1_000__00', '--price', '100_000_000_000'])
  expect(context).toHaveProperty('options')
  expect(context.options).toHaveProperty('amount', 100000)
  expect(context.options).toHaveProperty('price', 100000000000n)
})

it('should raise error when only underscore is given for bigint option', async () => {
  const context = await parser.parse(['buy', '--amount', '__1_0_0_0__', '--price', '_'])
  expect(context).toBe('Expected BigInt for price, got _')
})

it('should raise error when only underscore is given for number option', async () => {
  const context = await parser.parse(['buy', '--amount', '____', '--price', '1_0'])
  expect(context).toBe('Expected number for amount, got ____')
})

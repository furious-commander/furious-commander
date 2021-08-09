const { createParser, Command } = require('../../src/parser')

const parser = createParser()
parser.addCommand(
  new Command('sell')
    .withPositional({ key: 'amount', type: 'number', required: true })
    .withPositional({ key: 'price', type: 'bigint', required: true }),
)

it('should parse number and bigint arguments with underscore', async () => {
  const context = await parser.parse(['sell', '1_000', '100_000_000_000'])
  expect(context).toHaveProperty('arguments')
  expect(context.arguments).toHaveProperty('amount', 1000)
  expect(context.arguments).toHaveProperty('price', 100000000000n)
})

it('should raise error when only underscore is given for bigint argument', async () => {
  const context = await parser.parse(['sell', '1_000', '___'])
  expect(context).toBe('Expected BigInt for price, got ___')
})

it('should raise error when only underscore is given for number argument', async () => {
  const context = await parser.parse(['sell', '__', '1000'])
  expect(context).toBe('Expected number for amount, got __')
})

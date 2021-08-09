const { createParser, Command, Group } = require('../../src/parser')

const parser = createParser()
parser.addGroup(
  new Group('trade', 'Buy and sell assets')
    .withCommand(
      new Command('buy', 'Buy assets')
        .withOption({
          key: 'amount',
          type: 'bigint',
        })
        .withOption({ key: 'price', type: 'bigint' }),
    )
    .withCommand(
      new Command('sell', 'Sell assets')
        .withPositional({
          key: 'amount',
          type: 'number',
        })
        .withPositional({ key: 'price', type: 'number' }),
    ),
)

it('should parse k and K for bigint options', async () => {
  const context = await parser.parse(['trade', 'buy', '--amount', '10k', '--price', '1000K'])
  expect(context).toHaveProperty('options.amount', 10_000n)
  expect(context).toHaveProperty('options.price', 1_000_000n)
})

it('should parse m and M for number arguments', async () => {
  const context = await parser.parse(['trade', 'sell', '1M', '42m'])
  expect(context).toHaveProperty('arguments.amount', 1_000_000)
  expect(context).toHaveProperty('arguments.price', 42_000_000)
})

it('should parse b and B for bigint options', async () => {
  const context = await parser.parse(['trade', 'buy', '--amount', '6b', '--price', '9B'])
  expect(context).toHaveProperty('options.amount', 6_000_000_000n)
  expect(context).toHaveProperty('options.price', 9_000_000_000n)
})

it('should parse t and T for number arguments', async () => {
  const context = await parser.parse(['trade', 'sell', '10t', '400T'])
  expect(context).toHaveProperty('arguments.amount', 10_000_000_000_000)
  expect(context).toHaveProperty('arguments.price', 400_000_000_000_000)
})

it('should not parse when multiple units are present for number', async () => {
  const context = await parser.parse(['trade', 'sell', '10kk', '400'])
  expect(context).toBe('Expected number for amount, got 10kk')
})

it('should not parse when multiple units are present for bigint', async () => {
  const context = await parser.parse(['trade', 'buy', '--amount', '6bk', '--price', '600'])
  expect(context).toBe('Expected BigInt for amount, got 6bk')
})

it('should not parse when unknown unit is present for number', async () => {
  const context = await parser.parse(['trade', 'sell', '10p', '300'])
  expect(context).toBe('Expected number for amount, got 10p')
})

it('should not parse when unknown unit is present for bigint', async () => {
  const context = await parser.parse(['trade', 'buy', '--amount', '2w', '--price', '200'])
  expect(context).toBe('Expected BigInt for amount, got 2w')
})

it('should parse unit mixed with separator for number arguments', async () => {
  const context = await parser.parse(['trade', 'sell', '1_0_k', '42_0_0_0m'])
  expect(context).toHaveProperty('arguments.amount', 10_000)
  expect(context).toHaveProperty('arguments.price', 42_000_000_000)
})

it('should parse unit mixed with separator for bigint options', async () => {
  const context = await parser.parse(['trade', 'buy', '--amount', '1_000K', '--price', '50_000m'])
  expect(context).toHaveProperty('options.amount', 1_000_000n)
  expect(context).toHaveProperty('options.price', 50_000_000_000n)
})

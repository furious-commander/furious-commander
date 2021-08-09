const { createParser, Command } = require('../../src/parser')

const parser = createParser()
parser.addCommand(
  new Command('withdraw', 'Test').withOption({
    key: 'amount',
    description: 'Test',
    type: 'bigint',
    required: true,
    minimum: 50,
  }),
)

it('should raise error when below bigint is below minimum', async () => {
  const context = await parser.parse(['withdraw', '--amount', '49'])
  expect(context).toBe('[amount] must be at least 50')
})

it('should allow bigint exactly the minimum', async () => {
  const context = await parser.parse(['withdraw', '--amount', '50'])
  expect(context).toHaveProperty('options')
  expect(context.options).toHaveProperty('amount', 50n)
})

it('should allow bigints that look less than minimum but have unit', async () => {
  const context = await parser.parse(['withdraw', '--amount', '1M'])
  expect(context).toHaveProperty('options')
  expect(context.options).toHaveProperty('amount', 1_000_000n)
})

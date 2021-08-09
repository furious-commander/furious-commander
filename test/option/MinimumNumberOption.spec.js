const { createParser, Command } = require('../../src/parser')

const parser = createParser()
parser.addCommand(
  new Command('deposit', 'Test').withOption({
    key: 'amount',
    description: 'Test',
    type: 'number',
    required: true,
    minimum: 100,
  }),
)

it('should raise error when below number is below minimum', async () => {
  const context = await parser.parse(['deposit', '--amount', '99'])
  expect(context).toBe('[amount] must be at least 100')
})

it('should allow numbers exactly the minimum', async () => {
  const context = await parser.parse(['deposit', '--amount', '100'])
  expect(context).toHaveProperty('options')
  expect(context.options).toHaveProperty('amount', 100)
})

it('should allow numbers that look less than minimum but have unit', async () => {
  const context = await parser.parse(['deposit', '--amount', '50k'])
  expect(context).toHaveProperty('options')
  expect(context.options).toHaveProperty('amount', 50_000)
})

const { createParser, Command } = require('../../src/parser')

const parser = createParser()
parser.addCommand(
  new Command('test', 'Test').withOption({ key: 'large', description: 'Test', type: 'bigint', required: true }),
)

it('should raise error when bigint option cannot be parsed', async () => {
  const context = await parser.parse(['test', '--large', 'a123'])
  expect(context).toBe('Expected BigInt for large, got a123')
})

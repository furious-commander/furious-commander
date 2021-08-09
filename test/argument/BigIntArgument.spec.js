const { createParser, Command } = require('../../src/parser')

const parser = createParser()
parser.addCommand(new Command('test', 'Test').withPositional({ key: 'argument', description: 'Test', type: 'bigint' }))

it('should parse argument as a bigint', async () => {
  const context = await parser.parse(['test', '21680'])
  expect(context).toHaveProperty('arguments')
  expect(context.arguments).toHaveProperty('argument', 21680n)
})

it('should raise error when argument is not a bigint', async () => {
  const context = await parser.parse(['test', 'localhost'])
  expect(context).toBe('Expected BigInt for argument, got localhost')
})

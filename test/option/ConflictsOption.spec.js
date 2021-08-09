const { createParser, Command } = require('../../src/parser')

const parser = createParser()
parser.addCommand(
  new Command('test', 'Test')
    .withOption({ key: 'a', description: 'Test', type: 'string', conflicts: 'b', required: true })
    .withOption({ key: 'b', description: 'Test', type: 'string', conflicts: 'a', required: true }),
)

it('should not allow two conflicting options', async () => {
  const context = await parser.parse(['test', '--a', '1', '--b', '2'])
  expect(context).toBe('a and b are incompatible, please only specify one.')
})

it('should allow one of two conflicting required options', async () => {
  const context = await parser.parse(['test', '--a', '1'])
  expect(context).toHaveProperty('options')
  expect(context.options).toHaveProperty('a', '1')
  expect(context.options).not.toHaveProperty('b')
})

it('should allow one of two conflicting required options v2', async () => {
  const context = await parser.parse(['test', '--b', '2'])
  expect(context).toHaveProperty('options')
  expect(context.options).toHaveProperty('b', '2')
  expect(context.options).not.toHaveProperty('a')
})

it('should require at least one of multiple conflicting required options', async () => {
  const context = await parser.parse(['test'])
  expect(context).toBe('Required option not provided: a')
})

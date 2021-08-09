const { createParser, Command } = require('../../src/parser')

const parser = createParser()
parser.addCommand(new Command('check', 'Test').withOption({ key: 'string', description: 'Test', type: 'string' }))

it('should parse strings with dashes', async () => {
  const context = await parser.parse(['check', '--string', '-test'])
  expect(context).toHaveProperty('options')
  expect(context.options).toHaveProperty('string', '-test')
})

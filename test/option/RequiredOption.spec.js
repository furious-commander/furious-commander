const { createParser, Command } = require('../../src/parser')

const parser = createParser()
parser.addCommand(
  new Command('require', 'Test').withOption({ key: 'mandatory', description: 'Test', type: 'string', required: true }),
)

it('should raise errors when required options are missing', async () => {
  const context = await parser.parse(['require'])
  expect(context).toBe('Required option not provided: mandatory')
})

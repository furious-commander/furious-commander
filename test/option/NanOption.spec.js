const { createParser, Command } = require('../../src/parser')

const parser = createParser()
parser.addCommand(
  new Command('check-number', 'Test').withOption({
    key: 'number',
    description: 'Test',
    type: 'number',
    required: true,
  }),
)

it('should raise error for nans', async () => {
  const context = await parser.parse(['check-number', '--number', 'a'])
  expect(context).toBe('Expected number for number, got a')
})

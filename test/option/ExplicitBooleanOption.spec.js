const { createParser, Command } = require('../../src/parser')

const parser = createParser()
parser.addCommand(
  new Command('migrate', 'Run migration').withOption({
    key: 'dry-run',
    description: 'Dry-run mode does not make actual changes',
    type: 'boolean',
  }),
)

it('should allow true as explicit boolean value', async () => {
  const context = await parser.parse(['migrate', '--dry-run', 'true'])
  expect(context).toHaveProperty('options')
  expect(context.options).toHaveProperty('dry-run', true)
})

it('should allow false as explicit boolean value', async () => {
  const context = await parser.parse(['migrate', '--dry-run', 'false'])
  expect(context).toHaveProperty('options')
  expect(context.options).toHaveProperty('dry-run', false)
})

const { createParser, Command } = require('../../src/parser')

const parser = createParser()
parser.addGlobalOption({ key: 'realm', description: 'N/A', type: 'string' })
parser.addCommand(new Command('parent', 'N/A'))
parser.addCommand(new Command('child', 'N/A', null, { sibling: 'parent' }))

it('should make global options available in sibling too', async () => {
  const context = await parser.parse(['child', '--realm', 'testnet'])
  expect(context).toHaveProperty('sibling')
  expect(context.sibling).toHaveProperty('options')
  expect(context.sibling.options).toHaveProperty('realm', 'testnet')
  expect(context).toHaveProperty('options')
  expect(context.options).toHaveProperty('realm', 'testnet')
})

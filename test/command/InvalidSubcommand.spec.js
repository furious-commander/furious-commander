const { createParser, Group } = require('../../src/parser')

const parser = createParser()
parser.addGroup(new Group('btc', 'Bitcoin operations'))

it('should raise errors on invalid subcommands', async () => {
  const context = await parser.parse(['btc', 'price'])
  expect(context).toBe('Not a valid command in group [btc]: price')
})

const { createParser, Command } = require('../../src/parser')

const parser = createParser()
parser.addCommand(new Command('list', 'List files', null, { alias: 'ls' }))

it('should find top level command by alias', async () => {
  const context = await parser.parse(['ls'])
  expect(context).toHaveProperty('group', undefined)
  expect(context).toHaveProperty('command')
  expect(context.command).toHaveProperty('key', 'list')
})

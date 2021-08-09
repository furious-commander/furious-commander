const { createParser, Command, Group } = require('../../src/parser')

const parser = createParser()
parser.addGroup(
  new Group('file', 'File operations').withCommand(new Command('upload', 'Upload file', null, { alias: 'up' })),
)

it('should find group command by alias', async () => {
  const context = await parser.parse(['file', 'up'])
  expect(context).toHaveProperty('group')
  expect(context.group).toHaveProperty('key', 'file')
  expect(context).toHaveProperty('command')
  expect(context.command).toHaveProperty('key', 'upload')
})

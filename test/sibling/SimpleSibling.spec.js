const { createParser, Command, Group } = require('../../src/parser')

const parser = createParser()
parser.addGroup(
  new Group('feed', 'Test').withCommand(new Command('upload', 'Upload to feed', null, { sibling: 'upload' })),
)
parser.addCommand(
  new Command('upload', 'Upload file').withPositional({ key: 'path', description: 'Path to file', type: 'string' }),
)

it('should support sibling commands', async () => {
  const context = await parser.parse(['feed', 'upload', 'README.md'])
  expect(context).toHaveProperty('group')
  expect(context).toHaveProperty('command')
  expect(context).toHaveProperty('sibling')
  expect(context.group).toHaveProperty('key', 'feed')
  expect(context.command).toHaveProperty('key', 'upload')
  expect(context.sibling).toHaveProperty('command')
  expect(context.sibling).toHaveProperty('arguments')
  expect(context.sibling).not.toHaveProperty('group')
  expect(context.sibling.command).toHaveProperty('key', 'upload')
  expect(context.sibling.command).toHaveProperty('fullPath', 'upload')
  expect(context.sibling.arguments).toHaveProperty('path', 'README.md')
})

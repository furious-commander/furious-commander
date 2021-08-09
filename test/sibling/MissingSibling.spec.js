const { createParser, Command, Group } = require('../../src/parser')

const parser = createParser()
parser.addGroup(
  new Group('feed', 'Test').withCommand(new Command('upload', 'Upload to feed', null, { sibling: 'upload' })),
)

it('should raise errors for missing siblings', async () => {
  const context = await parser.parse(['feed', 'upload', 'README.md'])
  expect(context).toBe('Expected sibling command not found!')
})

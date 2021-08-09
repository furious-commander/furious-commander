const { createParser, Group, Command } = require('../../src/parser')

const parser = createParser()
parser.addCommand(
  new Command('mkdir', 'Create a directory').withPositional({
    key: 'path',
    description: 'Path to directory (will be created)',
    type: 'string',
    required: true,
  }),
)
parser.addGroup(
  new Group('github', 'Github commands').withGroup(
    new Group('project', 'Manage Github projects').withCommand(
      new Command('init', 'Create project', null, { sibling: 'mkdir' }).withPositional({
        key: 'name',
        description: 'Project name',
        type: 'string',
        required: true,
      }),
    ),
  ),
)

it('should combine arguments from self and sibling', async () => {
  const context = await parser.parse(['github', 'project', 'init', '~/Projects/MyAwesomeProject', 'react-sample-app'])
  expect(context).toHaveProperty('arguments')
  expect(context).toHaveProperty('sibling')
  expect(context.sibling).toHaveProperty('arguments')
  expect(context.arguments).toHaveProperty('name', 'react-sample-app')
  expect(context.sibling.arguments).toHaveProperty('path', '~/Projects/MyAwesomeProject')
})

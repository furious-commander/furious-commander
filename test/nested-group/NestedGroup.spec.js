const { createParser, Command, Group } = require('../../src/parser')

const parser = createParser()
parser.addGroup(
  new Group('primary', 'N/A').withGroup(
    new Group('secondary', 'N/A').withGroup(
      new Group('tertiary', 'N/A').withGroup(new Group('quaternary', 'N/A').withCommand(new Command('command', 'N/A'))),
    ),
  ),
)

it('should find command within nested groups', async () => {
  const context = await parser.parse(['primary', 'secondary', 'tertiary', 'quaternary', 'command'])
  expect(context).toHaveProperty('group')
  expect(context.group).toHaveProperty('fullPath', 'primary secondary tertiary quaternary')
  expect(context.group).toHaveProperty('key', 'quaternary')
  expect(context).toHaveProperty('command')
  expect(context.command).toHaveProperty('key', 'command')
  expect(context.command).toHaveProperty('fullPath', 'primary secondary tertiary quaternary command')
})

it('should find intermediary group within nested groups', async () => {
  const context = await parser.parse(['primary', 'secondary', 'tertiary'])
  expect(context).toBe('You need to specify a command in group [tertiary]')
})

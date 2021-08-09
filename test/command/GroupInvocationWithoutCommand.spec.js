const { createParser, Group, Command } = require('../../src/parser')

const parser = createParser()
parser.addGroup(
  new Group('server', 'Manage server')
    .withCommand(new Command('start', 'Start server', null, { alias: 'run' }))
    .withCommand(new Command('stop', 'Stop server')),
)

it('should not find any commands when only typing group', async () => {
  const context = await parser.parse(['server'])
  expect(context).toBe('You need to specify a command in group [server]')
})

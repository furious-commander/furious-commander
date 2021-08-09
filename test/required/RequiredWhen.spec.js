const { createParser, Command } = require('../../src/parser')

const parser = createParser()
parser.addGlobalOption({
  key: 'silent',
  type: 'boolean',
})
parser.addCommand(new Command('system').withOption({ key: 'operation', required: { when: 'silent' } }))

it('should raise error when silent and option is not passed', async () => {
  const context = await parser.parse(['system', '--silent'])
  expect(context).toBe('Required option not provided: operation')
})

it('should not raise error when not silent and option is not passed', async () => {
  const context = await parser.parse(['system'])
  expect(context).toHaveProperty('options.silent', undefined)
})

it('should not raise error when silent and option is passed', async () => {
  const context = await parser.parse(['system', '--silent', '--operation', 'reboot'])
  expect(context).toHaveProperty('options.operation', 'reboot')
  expect(context).toHaveProperty('options.silent', true)
})

it('should not raise error when not silent and option is passed', async () => {
  const context = await parser.parse(['system', '--operation', 'reboot'])
  expect(context).toHaveProperty('options.operation', 'reboot')
})

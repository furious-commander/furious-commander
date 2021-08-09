const { createParser, Command } = require('../../src/parser')

const parser = createParser()
parser.addGlobalOption({
  key: 'interactive',
  type: 'boolean',
})
parser.addGlobalOption({
  key: 'silent',
  type: 'boolean',
})
parser.addGlobalOption({
  key: 'help',
  type: 'boolean',
})
parser.addCommand(new Command('system').withOption({ key: 'operation', required: { unless: 'interactive' } }))
parser.addCommand(new Command('service').withOption({ key: 'operation', required: { when: 'silent' } }))

it('should print required unless condition', () => {
  process.stdout.write = jest.fn()
  parser.parse(['system', '--help'])
  const calls = process.stdout.write.mock.calls
  expect(calls[8][0]).toContain('operation')
  expect(calls[8][0]).toContain('[required unless interactive]')
})

it('should print required when condition', () => {
  process.stdout.write = jest.fn()
  parser.parse(['service', '--help'])
  const calls = process.stdout.write.mock.calls
  expect(calls[8][0]).toContain('operation')
  expect(calls[8][0]).toContain('[required when silent]')
})

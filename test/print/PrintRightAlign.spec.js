const { createParser, Command } = require('../../src/parser')

it('should left align when split to 3 lines', () => {
  process.stdout.write = jest.fn()
  const parser = createParser()
  parser.addGlobalOption({
    key: 'this-is-a-very-very-very-long-command-key',
    description: 'And this is an even longer description of the command',
    type: 'string',
    default: 'this is a very long default value',
  })
  parser.addCommand(new Command('sample', 'N/A'))
  parser.parse([''])
  const calls = process.stdout.write.mock.calls
  expect(calls[14][0].startsWith('   --this-is-a-very-very-very-long-command-key')).toBeTruthy()
  expect(calls[15][0].startsWith('[string][default this is a very long default value]')).toBeTruthy()
  expect(calls[16][0].startsWith('And this is an even longer description of the command')).toBeTruthy()
})

it('should right align meta when split to 2 lines', () => {
  process.stdout.write = jest.fn()
  const parser = createParser()
  parser.addGlobalOption({
    key: 'this-is-a-long-command-key',
    description: 'And this is an even longer description of the command',
    type: 'string',
    default: 'this is a long default value',
  })
  parser.addCommand(new Command('sample', 'N/A'))
  parser.parse([''])
  const calls = process.stdout.write.mock.calls
  expect(calls[14][0].startsWith('   --this-is-a-long-command-key')).toBeTruthy()
  expect(calls[14][0].endsWith('[string][default this is a long default value]\n')).toBeTruthy()
  expect(calls[14][0].length).toBe(101)
})

it('should right align meta when inline', () => {
  process.stdout.write = jest.fn()
  const parser = createParser()
  parser.addGlobalOption({
    key: 'command-key',
    description: 'Command description',
    type: 'string',
    default: 'default value',
  })
  parser.addCommand(new Command('sample', 'N/A'))
  parser.parse([''])
  const calls = process.stdout.write.mock.calls
  expect(calls[14][0].startsWith('   --command-key')).toBeTruthy()
  expect(calls[14][0].endsWith('[string][default default value]\n')).toBeTruthy()
  expect(calls[14][0].length).toBe(101)
})

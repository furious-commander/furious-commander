const { createParser, Command } = require('../../src/parser')

process.stdout.write = jest.fn()

const parser = createParser()
parser.addGlobalOption({ key: 'colors', description: 'Use colors', type: 'boolean' })
parser.addCommand(
  new Command('print', 'Print')
    .withOption({
      key: 'verbose',
      description: 'Verbose',
      required: true,
      conflicts: 'silent',
    })
    .withOption({
      key: 'silent',
      description: 'Silent',
      required: true,
      conflicts: 'verbose',
    }),
)

it('should print xor message', () => {
  parser.parse(['print'])
  const calls = global.process.stdout.write.mock.calls
  expect(calls[9][0]).toContain('--silent')
  expect(calls[10][0]).toBe('\n')
  expect(calls[11][0]).toContain('Only one is required: [silent] or [verbose]\n')
  expect(calls[12][0]).toBe('\n')
  expect(calls[13][0]).toContain('Global Options')
})

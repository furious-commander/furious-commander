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
    })
    .withOption({
      key: 'stdout',
      description: 'Print to stdout',
      required: true,
      conflicts: 'file',
    })
    .withOption({
      key: 'file',
      description: 'Print to file',
      required: true,
      conflicts: 'stdout',
    }),
)

it('should print xor message', () => {
  parser.parse(['print'])
  const calls = process.stdout.write.mock.calls
  expect(calls[11][0]).toContain('--file')
  expect(calls[12][0]).toBe('\n')
  expect(calls[13][0]).toContain('Only one is required: [silent] or [verbose], [file] or [stdout]\n')
  expect(calls[14][0]).toBe('\n')
  expect(calls[15][0]).toContain('Global Options')
})

const { createParser, Command } = require('../../src/parser')

process.stdout.write = jest.fn()

const parser = createParser()
parser.addCommand(
  new Command('2hex', 'Test')
    .withOption({ key: 'block', description: 'Test', type: 'string', required: true })
    .withOption({ key: 'bytes-1', description: 'Test', type: 'string', default: '00000000000000000000000000000000' })
    .withOption({
      key: 'bytes-2',
      description: 'Test',
      type: 'string',
      default: '00000000000000000000000000000000',
      defaultDescription: '0x00 ** 32',
    }),
)

it('should print custom default text', () => {
  parser.parse(['2hex'])
  const calls = process.stdout.write.mock.calls
  expect(calls[12][0]).toContain('--bytes-1')
  expect(calls[12][0]).toContain('[default 00000000000000000000000000000000]')
  expect(calls[13][0]).toContain('--bytes-2')
  expect(calls[13][0]).toContain('[default 0x00 ** 32]')
})

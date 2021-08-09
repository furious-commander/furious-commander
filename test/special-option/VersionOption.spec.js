const { createParser } = require('../../src/parser')

const parser = createParser()
parser.addGlobalOption({
  key: 'version',
  description: 'Print version and quit',
  type: 'boolean',
  alias: 'V',
  handler: () => {
    process.stdout.write('0.1.0\n')
  },
})

it('should handle --version specially', async () => {
  const context = await parser.parse(['--version'])
  expect(context).toHaveProperty('exitReason', 'version')
})

it('should handle -V specially', async () => {
  const context = await parser.parse(['-V'])
  expect(context).toHaveProperty('exitReason', 'version')
})

it('should not handle -v', async () => {
  const context = await parser.parse(['-v'])
  expect(context).toBe('Not a valid group or command: -v')
})

const { createParser, Command } = require('../../src/parser')

const parser = createParser()
parser.addCommand(
  new Command('encrypt')
    .withOption({
      key: 'key',
      description: 'Encryption key',
      type: 'hex-string',
      default: 'cafebabe',
      required: true,
      conflicts: 'key-phrase',
    })
    .withOption({
      key: 'key-phrase',
      description: 'Human readable phrase to construct key from',
      required: true,
      conflicts: 'key',
    }),
)

it('should get default value from key when key-phrase is not given', async () => {
  const context = await parser.parse(['encrypt'])
  expect(context).toHaveProperty('options.key', 'cafebabe')
})

it('should get value from key-phrase when given', async () => {
  const context = await parser.parse(['encrypt', '--key-phrase', 'Dead Beef'])
  expect(context).toHaveProperty('options.key-phrase', 'Dead Beef')
})

it('should get value from key when given', async () => {
  const context = await parser.parse(['encrypt', '--key', '0xDEadBEef'])
  expect(context).toHaveProperty('options.key', 'deadbeef')
})

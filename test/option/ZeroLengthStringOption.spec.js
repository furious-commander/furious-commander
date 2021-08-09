const { createParser, Command } = require('../../src/parser')
const { tokenize } = require('../../src/parser/tokenize')

const parser = createParser()
parser.addCommand(
  new Command('length').withOption({ key: 'string', required: true, minimumLength: 0, maximumLength: 20 }),
)
parser.addCommand(new Command('lengthof').withOption({ key: 'string', minimumLength: 0, maximumLength: 20 }))
parser.addCommand(new Command('save').withOption({ key: 'string', maximumLength: 20 }))

it('should allow zero length required string if minimumLength is 0', async () => {
  const context = await parser.parse(['length', '--string', ''])
  expect(context).toHaveProperty('options.string', '')
})

it('should allow zero length required string if minimumLength is 0 and tokenized with single quotes', async () => {
  const context = await parser.parse(tokenize("length --string ''").argv)
  expect(context).toHaveProperty('options.string', '')
})

it('should allow zero length optional string if minimumLength is 0', async () => {
  const context = await parser.parse(['lengthof', '--string', ''])
  expect(context).toHaveProperty('options.string', '')
})

it('should allow zero length optional string if minimumLength is 0 and tokenized with double quotes', async () => {
  const context = await parser.parse(tokenize('lengthof --string ""').argv)
  expect(context).toHaveProperty('options.string', '')
})

it('should allow zero length optional string if minimumLength is 0 and tokenized with single quotes', async () => {
  const context = await parser.parse(tokenize("lengthof --string ''").argv)
  expect(context).toHaveProperty('options.string', '')
})

it('should not allow zero length if minimum length is not set', async () => {
  const context = await parser.parse(['save', '--string', ''])
  expect(context).toBe('[string] must not be empty')
})

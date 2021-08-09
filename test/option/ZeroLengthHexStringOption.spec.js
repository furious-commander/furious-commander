const { createParser, Command } = require('../../src/parser')

const parser = createParser()
parser.addCommand(
  new Command('ascii').withOption({
    key: 'hex',
    required: true,
    type: 'hex-string',
    minimumLength: 0,
    maximumLength: 20,
  }),
)
parser.addCommand(
  new Command('base64').withOption({
    key: 'hex',
    required: true,
    type: 'hex-string',
  }),
)

it('should allow zero length hex-string if minimumLength is 0', async () => {
  const context = await parser.parse(['ascii', '--hex', ''])
  expect(context).toHaveProperty('options.hex', '')
})

it('should not allow zero length hex-string if minimumLength is not 0', async () => {
  const context = await parser.parse(['base64', '--hex', ''])
  expect(context).toBe('[hex] must not be empty')
})

it('should allow zero length hex-string with prefix if minimumLength is 0', async () => {
  const context = await parser.parse(['ascii', '--hex', '0x'])
  expect(context).toHaveProperty('options.hex', '')
})

it('should not allow zero length hex-string with prefix if minimumLength is not 0', async () => {
  const context = await parser.parse(['base64', '--hex', '0x'])
  expect(context).toBe('[hex] must not be empty')
})

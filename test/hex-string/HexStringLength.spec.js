const { createParser, Command } = require('../../src/parser')

const parser = createParser()
parser.addCommand(
  new Command('tx', 'Look up transaction').withPositional({
    key: 'txid',
    type: 'hex-string',
    length: 20,
  }),
)
parser.addCommand(
  new Command('hex2ascii', 'Convert hex to ascii').withPositional({
    key: 'hex',
    type: 'hex-string',
    minimumLength: 4,
    maximumLength: 20,
  }),
)

it('should accept exactly 20 characters', async () => {
  const context = await parser.parse(['tx', '24252627abacafad9878'])
  expect(context).toHaveProperty('arguments.txid', '24252627abacafad9878')
})

it('should accept exactly 20 characters ignoring 0x prefix', async () => {
  const context = await parser.parse(['tx', '0xaaaaaaaaaabbbbbbbbbb'])
  expect(context).toHaveProperty('arguments.txid', 'aaaaaaaaaabbbbbbbbbb')
})

it('should not accept more characters than exact length', async () => {
  const context = await parser.parse(['tx', 'aaaaaaaaaabbbbbbbbbb11'])
  expect(context).toBe('[txid] must have length of 20 characters')
})

it('should not accept less characters than exact length', async () => {
  const context = await parser.parse(['tx', 'aaaaaaaaaabbbbbbbb'])
  expect(context).toBe('[txid] must have length of 20 characters')
})

it('should not accept odd-length strings', async () => {
  const context = await parser.parse(['hex2ascii', '0xabcde'])
  expect(context).toBe('[hex] must have even length')
})

it('should not accept more characters than maximum length', async () => {
  const context = await parser.parse(['hex2ascii', '2244668800224466880022'])
  expect(context).toBe('[hex] must have length of at most 20 characters')
})

it('should not accept less characters than minimum length', async () => {
  const context = await parser.parse(['hex2ascii', '42'])
  expect(context).toBe('[hex] must have length of at least 4 characters')
})

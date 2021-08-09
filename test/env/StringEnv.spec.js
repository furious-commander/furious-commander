const { createParser, Command } = require('../../src/parser')

const parser = createParser()
parser.addCommand(
  new Command('ping', 'Ping address').withOption({
    key: 'address',
    description: 'Address',
    type: 'string',
    envKey: 'PING_ADDRESS',
  }),
)

it('should use string value from env', async () => {
  process.env.PING_ADDRESS = '8.8.8.8'
  const context = await parser.parse(['ping'])
  expect(context).toHaveProperty('options')
  expect(context.options).toHaveProperty('address', '8.8.8.8')
})

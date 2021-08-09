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

it('should use value from specified option, not env', async () => {
  process.env.PING_ADDRESS = '8.8.8.8'
  const context = await parser.parse(['ping', '--address', '127.0.0.1'])
  expect(context).toHaveProperty('options')
  expect(context.options).toHaveProperty('address', '127.0.0.1')
})

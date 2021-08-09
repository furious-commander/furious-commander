const { createParser, Command } = require('../../src/parser')

const parser = createParser()
parser.addCommand(
  new Command('ping')
    .withOption({
      key: 'host',
      default: 'localhost',
      required: {
        when: 'protocol',
      },
    })
    .withOption({
      key: 'protocol',
      default: 'http',
      required: {
        when: 'host',
      },
    }),
)

it('should have both defaults', async () => {
  const context = await parser.parse(['ping'])
  expect(context.options).toHaveProperty('protocol', 'http')
  expect(context.options).toHaveProperty('host', 'localhost')
})

it('should allow passing both options', async () => {
  const context = await parser.parse(['ping', '--protocol', 'tcp', '--host', '192.168.1.1'])
  expect(context.options).toHaveProperty('protocol', 'tcp')
  expect(context.options).toHaveProperty('host', '192.168.1.1')
})

it('should allow passing both options when both options are explicit defaults', async () => {
  const context = await parser.parse(['ping', '--protocol', 'http', '--host', 'localhost'])
  expect(context.options).toHaveProperty('protocol', 'http')
  expect(context.options).toHaveProperty('host', 'localhost')
})

it('should allow passing both options when option 1 is explicit default', async () => {
  const context = await parser.parse(['ping', '--protocol', 'http', '--host', '192.168.1.1'])
  expect(context.options).toHaveProperty('protocol', 'http')
  expect(context.options).toHaveProperty('host', '192.168.1.1')
})

it('should allow passing both options when option 2 is explicit default', async () => {
  const context = await parser.parse(['ping', '--protocol', 'tcp', '--host', 'localhost'])
  expect(context.options).toHaveProperty('protocol', 'tcp')
  expect(context.options).toHaveProperty('host', 'localhost')
})

it('should require option 2 when 1 is set explicitly', async () => {
  const context = await parser.parse(['ping', '--protocol', 'tcp'])
  expect(context).toBe('Required option not provided: host')
})

it('should require option 1 when 2 is set explicitly', async () => {
  const context = await parser.parse(['ping', '--host', '192.168.1.1'])
  expect(context).toBe('Required option not provided: protocol')
})

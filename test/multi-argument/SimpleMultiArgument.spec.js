const { createParser, Group, Command } = require('../../src/parser')

const parser = createParser()
parser.addCommand(
  new Command('copy', 'Copies a file')
    .withPositional({ key: 'source', description: 'Path to file', type: 'string', required: true })
    .withPositional({ key: 'target', description: 'Target path', type: 'string', required: true }),
)
parser.addGroup(
  new Group('color', 'Color conversions').withCommand(
    new Command('rgb2hex', 'RGB -> Hex')
      .withPositional({ key: 'r', description: 'Red (0 - 255)', type: 'number', required: true })
      .withPositional({ key: 'g', description: 'Green (0 - 255)', type: 'number', required: true })
      .withPositional({ key: 'b', description: 'Blue (0 - 255)', type: 'number', required: true }),
  ),
)

it('should allow passing multiple arguments in top level command', async () => {
  const context = await parser.parse(['copy', 'config.json', 'config.json.bkp'])
  expect(context).toHaveProperty('arguments')
  expect(context.arguments).toHaveProperty('source', 'config.json')
  expect(context.arguments).toHaveProperty('target', 'config.json.bkp')
})

it('should allow passing multiple arguments in group', async () => {
  const context = await parser.parse(['color', 'rgb2hex', '128', '90', '40'])
  expect(context).toHaveProperty('arguments')
  expect(context.arguments).toHaveProperty('r', 128)
  expect(context.arguments).toHaveProperty('g', 90)
  expect(context.arguments).toHaveProperty('b', 40)
})

const { createParser, Group, Command } = require('../../src/parser')

process.stdout.write = jest.fn()

const parser = createParser()
parser.addGroup(
  new Group('color', 'Color conversions').withCommand(
    new Command('rgb2hex', 'RGB -> Hex')
      .withPositional({ key: 'r', description: 'Red (0 - 255)', type: 'number', required: true })
      .withPositional({ key: 'g', description: 'Green (0 - 255)', type: 'number', required: true })
      .withPositional({ key: 'b', description: 'Blue (0 - 255)', type: 'number', required: true }),
  ),
)

it('should print all arguments', () => {
  parser.parse(['color', 'rgb2hex'])
  const calls = process.stdout.write.mock.calls
  expect(calls[2][0]).toContain('color rgb2hex <r> <g> <b> [OPTIONS]')
})

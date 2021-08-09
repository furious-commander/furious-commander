const { createParser, Group } = require('../../src/parser')

process.stdout.write = jest.fn()

const parser = createParser()
parser.addGroup(new Group('only-group', 'This is the only group.'))

it('should print the group', () => {
  parser.parse([''])
  const calls = process.stdout.write.mock.calls
  expect(calls).toHaveLength(12)
  expect(calls[0][0]).toBe('Node.js CLI 1.0.0 - Powered by open source technologies\n')
  expect(calls[1][0]).toBe('\n')
  expect(calls[2][0]).toBe('█ Usage:\n')
  expect(calls[3][0]).toBe('\n')
  expect(calls[4][0]).toBe('node COMMAND [OPTIONS]\n')
  expect(calls[5][0]).toBe('\n')
  expect(calls[6][0]).toBe('█ Available Groups:\n')
  expect(calls[7][0]).toBe('\n')
  expect(calls[8][0]).toBe('only-group   This is the only group.\n')
  expect(calls[9][0]).toBe('\n')
  expect(calls[10][0]).toBe("Run 'node GROUP --help' to see available commands in a group\n")
  expect(calls[11][0]).toBe('\n')
})

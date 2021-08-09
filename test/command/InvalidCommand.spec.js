const { createParser } = require('../../src/parser')

const parser = createParser()

it('should raise error on invalid commands', async () => {
  const context = await parser.parse(['invalid'])
  expect(context).toBe('Not a valid group or command: invalid')
})

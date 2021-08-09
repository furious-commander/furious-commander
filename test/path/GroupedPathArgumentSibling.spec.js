const { createParser, Command, Group } = require('../../src/parser')
const { setupTestData } = require('../test-data')

const parser = createParser()
parser.addCommand(new Command('upload').withPositional({ key: 'path', autocompletePath: true }))
parser.addGroup(new Group('advanced').withCommand(new Command('upload', null, null, { sibling: 'upload' })))
setupTestData()

it('should complete partial path for grouped command with sibling argument', async () => {
  const suggestions = await parser.suggest('advanced upload test-d')
  expect(suggestions).toHaveLength(1)
  expect(suggestions[0]).toBe('test-data/')
})

it('should complete empty path for grouped command with sibling argument', async () => {
  const suggestions = await parser.suggest('advanced upload ')
  expect(suggestions).toContain('test-data/')
})

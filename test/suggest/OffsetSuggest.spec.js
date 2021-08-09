const { createParser, Command, Group } = require('../../src/parser')

const parser = createParser()
parser.addGroup(new Group('project').withCommand(new Command('open')))

it('should suggest group with offset and empty command path', async () => {
  const suggestions = await parser.suggest('cafe ', 1)
  expect(suggestions).toStrictEqual(['project'])
})

it('should suggest group with offset and partial matching command path', async () => {
  const suggestions = await parser.suggest('cafe pro', 1)
  expect(suggestions).toStrictEqual(['project'])
})

it('should suggest group with offset and fully matching command path', async () => {
  const suggestions = await parser.suggest('cafe project', 1)
  expect(suggestions).toStrictEqual(['project'])
})

it('should suggest command with offset and empty command path', async () => {
  const suggestions = await parser.suggest('cafe project ', 1)
  expect(suggestions).toStrictEqual(['open'])
})

it('should suggest command with offset and partial matching command path', async () => {
  const suggestions = await parser.suggest('cafe project o', 1)
  expect(suggestions).toStrictEqual(['open'])
})

it('should suggest command with offset and fully matching command path', async () => {
  const suggestions = await parser.suggest('cafe project open', 1)
  expect(suggestions).toStrictEqual(['open'])
})

it('should not suggest anything after full path', async () => {
  const suggestions = await parser.suggest('cafe project open ', 1)
  expect(suggestions).toStrictEqual([])
})

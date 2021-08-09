const { createParser, Command } = require('../../src/parser')
const { setupTestData } = require('../test-data')

const parser = createParser()
parser.addCommand(
  new Command('post')
    .withPositional({
      key: 'path',
      autocompletePath: true,
    })
    .withOption({ key: 'noise' }),
)
parser.addCommand(new Command('post-verify', '', null, { sibling: 'post' }))
parser.addCommand(new Command('http'))
parser.addCommand(
  new Command('send', '', null, { sibling: 'http' }).withPositional({
    key: 'path',
    autocompletePath: true,
  }),
)
parser.addCommand(
  new Command('decode').withPositional({
    key: 'key-file',
    autocompletePath: true,
  }),
)
parser.addCommand(
  new Command('transfer', '', null, { sibling: 'decode' }).withPositional({
    key: 'path',
    autocompletePath: true,
  }),
)

setupTestData()

it('should complete path for sibling', async () => {
  const suggestions = await parser.suggest('post-verify test-d')
  expect(suggestions).toHaveLength(1)
  expect(suggestions[0]).toBe('test-data/')
})

it('should complete path for self with empty sibling', async () => {
  const suggestions = await parser.suggest('send test-d')
  expect(suggestions).toHaveLength(1)
  expect(suggestions[0]).toBe('test-data/')
})

it('should complete first path', async () => {
  const suggestions = await parser.suggest('transfer test-d')
  expect(suggestions).toHaveLength(1)
  expect(suggestions[0]).toBe('test-data/')
})

it('should complete second path', async () => {
  const suggestions = await parser.suggest('transfer test-data test-da')
  expect(suggestions).toHaveLength(1)
  expect(suggestions[0]).toBe('test-data/')
})

it('should complete after first path', async () => {
  const suggestions = await parser.suggest('transfer ')
  expect(suggestions).toContain('test-data/')
})

it('should complete after second path', async () => {
  const suggestions = await parser.suggest('transfer test-data ')
  expect(suggestions).toContain('test-data/')
})

it('should not complete third path', async () => {
  const suggestions = await parser.suggest('transfer test-data test-data test-da')
  expect(suggestions).toHaveLength(0)
})

const { createParser, Command } = require('../../src/parser')

const parser = createParser()
parser.addGlobalOption({
  key: 'colors',
  type: 'boolean',
})
parser.addCommand(
  new Command('ls', 'List files')
    .withOption({
      key: 'long',
      alias: 'l',
    })
    .withOption({
      key: 'all',
      alias: 'a',
    }),
)

it('should suggest all options', async () => {
  const suggestions = await parser.suggest('ls ')
  expect(suggestions).toHaveProperty('length', 3)
  expect(suggestions).toHaveProperty('0', '--long')
  expect(suggestions).toHaveProperty('1', '--all')
  expect(suggestions).toHaveProperty('2', '--colors')
})

it('should complete current option via key', async () => {
  const suggestions = await parser.suggest('ls --lo')
  expect(suggestions).toHaveProperty('length', 1)
  expect(suggestions).toHaveProperty('0', '--long')
})

it('should complete current option via alias', async () => {
  const suggestions = await parser.suggest('ls -a')
  expect(suggestions).toHaveProperty('length', 1)
  expect(suggestions).toHaveProperty('0', '-a')
})

it('should suggest multiple matching options', async () => {
  const suggestions = await parser.suggest('ls ')
  expect(suggestions).toHaveProperty('length', 3)
  expect(suggestions).toHaveProperty('0', '--long')
  expect(suggestions).toHaveProperty('1', '--all')
  expect(suggestions).toHaveProperty('2', '--colors')
})

it('should suggest multiple matching options when -- is passed', async () => {
  const suggestions = await parser.suggest('ls --')
  expect(suggestions).toHaveProperty('length', 3)
  expect(suggestions).toHaveProperty('0', '--long')
  expect(suggestions).toHaveProperty('1', '--all')
  expect(suggestions).toHaveProperty('2', '--colors')
})

it('should suggest multiple matching options when - is passed', async () => {
  const suggestions = await parser.suggest('ls -')
  expect(suggestions).toHaveProperty('length', 3)
  expect(suggestions).toHaveProperty('0', '--long')
  expect(suggestions).toHaveProperty('1', '--all')
  expect(suggestions).toHaveProperty('2', '--colors')
})

it('should not suggest option already specified via key', async () => {
  const suggestions = await parser.suggest('ls --long ')
  expect(suggestions).toHaveProperty('length', 2)
  expect(suggestions).toHaveProperty('0', '--all')
  expect(suggestions).toHaveProperty('1', '--colors')
})

it('should not suggest option already specified via alias', async () => {
  const suggestions = await parser.suggest('ls -a ')
  expect(suggestions).toHaveProperty('length', 2)
  expect(suggestions).toHaveProperty('0', '--long')
  expect(suggestions).toHaveProperty('1', '--colors')
})

it('should not complete option already specified via key', async () => {
  const suggestions = await parser.suggest('ls --all --al')
  expect(suggestions).toHaveProperty('length', 0)
})

it('should not complete option already specified via alias', async () => {
  const suggestions = await parser.suggest('ls -a --al')
  expect(suggestions).toHaveProperty('length', 0)
})

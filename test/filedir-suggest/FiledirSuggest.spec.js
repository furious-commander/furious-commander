const { createParser, Command, Group } = require('../../src/parser')

const parser = createParser({
  pathResolver: () => ['__filedir'],
})
parser.addCommand(
  new Command('encrypt')
    .withPositional({
      key: 'key',
    })
    .withPositional({
      key: 'path',
      autocompletePath: true,
    }),
)
parser.addCommand(
  new Command('upload').withPositional({
    key: 'path',
    autocompletePath: true,
  }),
)
parser.addCommand(
  new Command('upload-via-option').withOption({
    key: 'path',
    autocompletePath: true,
  }),
)
parser.addGroup(
  new Group('encrypted').withCommand(
    new Command('upload')
      .withPositional({
        key: 'path',
        autocompletePath: true,
      })
      .withPositional({
        key: 'key-path',
        autocompletePath: true,
      }),
  ),
)
parser.addGlobalOption({
  key: 'quiet',
  type: 'boolean',
})

it('should signal filedir when argument takes a path', async () => {
  const suggestions = await parser.suggest('upload ')
  expect(suggestions).toHaveLength(1)
  expect(suggestions[0]).toBe('__filedir')
})

it('should signal filedir when argument takes a path and already typing', async () => {
  const suggestions = await parser.suggest('upload READM')
  expect(suggestions).toHaveLength(1)
  expect(suggestions[0]).toBe('__filedir')
})

it('should signal filedir when option takes a path', async () => {
  const suggestions = await parser.suggest('upload-via-option --path ')
  expect(suggestions).toHaveLength(1)
  expect(suggestions[0]).toBe('__filedir')
})

it('should signal filedir when option takes a path and already typing', async () => {
  const suggestions = await parser.suggest('upload-via-option --path LIC')
  expect(suggestions).toHaveLength(1)
  expect(suggestions[0]).toBe('__filedir')
})

it('should not signal anything when already typing non-path argument', async () => {
  const suggestions = await parser.suggest('encrypt secret12')
  expect(suggestions).toHaveLength(0)
})

it('should not signal anything when already typing non-path multi-word unclosed argument', async () => {
  const suggestions = await parser.suggest('encrypt "Awesome secret ke')
  expect(suggestions).toHaveLength(0)
})

it('should signal filedir when argument takes a path after other different argument', async () => {
  const suggestions = await parser.suggest('encrypt secret123 ')
  expect(suggestions).toHaveLength(1)
  expect(suggestions[0]).toBe('__filedir')
})

it('should signal filedir when argument takes a path after other different multi-word argument', async () => {
  const suggestions = await parser.suggest('encrypt "Awesome secret key" ')
  expect(suggestions).toHaveLength(1)
  expect(suggestions[0]).toBe('__filedir')
})

it('should signal filedir when argument takes a path after other different argument and already typing', async () => {
  const suggestions = await parser.suggest('encrypt secret123 CONT')
  expect(suggestions).toHaveLength(1)
  expect(suggestions[0]).toBe('__filedir')
})

it('should signal filedir for second path argument', async () => {
  const suggestions = await parser.suggest('encrypted upload README.md CONT')
  expect(suggestions).toHaveLength(1)
  expect(suggestions[0]).toBe('__filedir')
})

it('should signal filedir for second path argument after multi-word first path argument', async () => {
  const suggestions = await parser.suggest('encrypted upload "Awesome README.md" CONT')
  expect(suggestions).toHaveLength(1)
  expect(suggestions[0]).toBe('__filedir')
})

it('should signal filedir for multi-word second path argument after multi-word first path argument', async () => {
  const suggestions = await parser.suggest('encrypted upload "Awesome README.md" "Awesome CONT')
  expect(suggestions).toHaveLength(1)
  expect(suggestions[0]).toBe('__filedir')
})

it('should suggest option after specifying both paths', async () => {
  const suggestions = await parser.suggest('encrypted upload README.md key.bin ')
  expect(suggestions).toHaveLength(1)
  expect(suggestions).toHaveProperty('0', '--quiet')
})

it('should signal filedir for argument after short boolean option', async () => {
  const suggestions = await parser.suggest('upload --quiet ')
  expect(suggestions).toHaveLength(1)
  expect(suggestions[0]).toBe('__filedir')
})

it('should signal filedir for argument after short boolean option when already typing', async () => {
  const suggestions = await parser.suggest('upload --quiet REA')
  expect(suggestions).toHaveLength(1)
  expect(suggestions[0]).toBe('__filedir')
})

it('should signal filedir for argument after long boolean option', async () => {
  const suggestions = await parser.suggest('upload --quiet true ')
  expect(suggestions).toHaveLength(1)
  expect(suggestions[0]).toBe('__filedir')
})

it('should signal filedir for argument after short boolean option when already typing', async () => {
  const suggestions = await parser.suggest('upload --quiet CODEO')
  expect(suggestions).toHaveLength(1)
  expect(suggestions[0]).toBe('__filedir')
})

it('should suggest options when a dash is printed', async () => {
  const suggestions = await parser.suggest('upload -')
  expect(suggestions).toHaveLength(1)
  expect(suggestions).toHaveProperty('0', '--quiet')
})

it('should not suggest anything after path argument is satisfied', async () => {
  const suggestions = await parser.suggest('upload --quiet CODEOWNER ')
  expect(suggestions).toHaveLength(0)
})

it('should suggest filepath when writing unclosed quoted multi words', async () => {
  const suggestions = await parser.suggest('upload "My awesome file.tx')
  expect(suggestions).toHaveLength(1)
  expect(suggestions[0]).toBe('__filedir')
})

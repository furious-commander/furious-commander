const { tokenize } = require('../../src/parser/tokenize')

it('should parse simple string', () => {
  const { argv } = tokenize('ls -l -a')
  expect(argv).toStrictEqual(['ls', '-l', '-a'])
})

it('should shrink whitespaces', () => {
  const { argv } = tokenize('curl  http://localhost:8080')
  expect(argv).toStrictEqual(['curl', 'http://localhost:8080'])
})

it('should parse quoted parts as single', () => {
  const { argv } = tokenize('cp "Awesome File.txt" awesome-file.txt')
  expect(argv).toStrictEqual(['cp', 'Awesome File.txt', 'awesome-file.txt'])
})

it('should retain whitespaces within quotes', () => {
  const { argv } = tokenize('trim " spacey  words "')
  expect(argv).toStrictEqual(['trim', ' spacey  words '])
})

it('should allow nested quotes', () => {
  const { argv } = tokenize('echo "Hello \\"World\\""')
  expect(argv).toStrictEqual(['echo', 'Hello "World"'])
})

it('should allow mixed quotes', () => {
  const { argv } = tokenize(`diff "Hello World" 'Hello World'`)
  expect(argv).toStrictEqual(['diff', 'Hello World', 'Hello World'])
})

it('should retain nested quotes', () => {
  const { argv } = tokenize(`search "What is Occam's razor in layman's terms?"`)
  expect(argv).toStrictEqual(['search', "What is Occam's razor in layman's terms?"])
})

it('should append characters after closing quotes', () => {
  const { argv } = tokenize('cp "A F"i"le.txt" out.txt')
  expect(argv).toStrictEqual(['cp', 'A File.txt', 'out.txt'])
})

it('should slice argv by 1', () => {
  const { argv } = tokenize('cafe todo list', 1)
  expect(argv).toStrictEqual(['todo', 'list'])
})

it('should slice argv by 2', () => {
  const { argv } = tokenize('cafe project open self', 2)
  expect(argv).toStrictEqual(['open', 'self'])
})

it('should return empty array when offset if higher', () => {
  const { argv } = tokenize('history', 3)
  expect(argv).toStrictEqual([])
})

it('should return empty array when input is empty', () => {
  const { argv } = tokenize('')
  expect(argv).toStrictEqual([])
})

it('should parse empty strings with quotes', () => {
  const { argv } = tokenize('""')
  expect(argv).toStrictEqual([''])
})

it('should parse empty strings with apostrophes', () => {
  const { argv } = tokenize("''")
  expect(argv).toStrictEqual([''])
})

it('should parse empty strings at the end with quotes', () => {
  const { argv } = tokenize('--string ""')
  expect(argv).toStrictEqual(['--string', ''])
})

it('should parse empty strings at the end with apostrophes', () => {
  const { argv } = tokenize("--string ''")
  expect(argv).toStrictEqual(['--string', ''])
})

it('should parse empty strings between tokens with quotes', () => {
  const { argv } = tokenize('--string "" --quiet')
  expect(argv).toStrictEqual(['--string', '', '--quiet'])
})

it('should parse empty strings between tokens with apostrophes', () => {
  const { argv } = tokenize("--string '' --quiet")
  expect(argv).toStrictEqual(['--string', '', '--quiet'])
})

it('should parse empty strings with quotes with trailing space', () => {
  const { argv } = tokenize('--string "" ')
  expect(argv).toStrictEqual(['--string', ''])
})

it('should parse empty strings with apostrophes with trailing space', () => {
  const { argv } = tokenize("--string '' ")
  expect(argv).toStrictEqual(['--string', ''])
})

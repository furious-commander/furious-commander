const { createParser, Command } = require('../../src/parser')

const parser = createParser()
parser.addCommand(
  new Command('status', 'N/A').withOption({
    key: 'compact',
    type: 'boolean',
  }),
)

it('should suggest true when already typing for boolean', async () => {
  const suggestions = await parser.suggest('status --compact tr')
  expect(suggestions).toHaveProperty('length', 1)
  expect(suggestions).toHaveProperty('0', 'true')
})

it('should suggest false when already typing for boolean', async () => {
  const suggestions = await parser.suggest('status --compact fa')
  expect(suggestions).toHaveProperty('length', 1)
  expect(suggestions).toHaveProperty('0', 'false')
})

it('should suggest true when finished typing for boolean', async () => {
  const suggestions = await parser.suggest('status --compact true')
  expect(suggestions).toHaveProperty('length', 1)
  expect(suggestions).toHaveProperty('0', 'true')
})

it('should suggest false when finished typing for boolean', async () => {
  const suggestions = await parser.suggest('status --compact false')
  expect(suggestions).toHaveProperty('length', 1)
  expect(suggestions).toHaveProperty('0', 'false')
})

it('should suggest not suggest anything after short boolean', async () => {
  const suggestions = await parser.suggest('status --compact ')
  expect(suggestions).toHaveProperty('length', 0)
})

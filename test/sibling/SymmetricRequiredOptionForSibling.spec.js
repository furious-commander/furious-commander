const { createParser, Command } = require('../../src/parser')

const parser = createParser()
parser.addCommand(
  new Command('curl', 'Transfer a URL').withOption({
    key: 'url',
    description: 'URL',
    required: true,
  }),
)
parser.addCommand(
  new Command('post-json', 'Post JSON', null, { sibling: 'curl' }).withOption({
    key: 'data',
    description: 'JSON data',
    required: true,
  }),
)

it('should parse both required options', async () => {
  const context = await parser.parse(['post-json', '--data', '{"hello":"world"}', '--url', 'http://dev.local'])
  expect(context).toHaveProperty('options')
  expect(context.options).toHaveProperty('data', '{"hello":"world"}')
  expect(context).toHaveProperty('sibling')
  expect(context.sibling).toHaveProperty('options')
  expect(context.sibling.options).toHaveProperty('url', 'http://dev.local')
})

it('should raise error for missing required option on self', async () => {
  const context = await parser.parse(['post-json', '--url', 'http://dev.local'])
  expect(context).toBe('Required option not provided: data')
})

it('should raise error for missing required option on sibling', async () => {
  const context = await parser.parse(['post-json', '--data', '{"hello":"world"}'])
  expect(context).toBe('Required option not provided: url')
})

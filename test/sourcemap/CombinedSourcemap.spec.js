const { createParser, Command, Group } = require('../../src/parser')

const parser = createParser()
parser.addGlobalOption({
  key: 'rss-config-path',
  description: 'Path to the RSS config folder',
  default: '~/.rss',
  envKey: 'RSS_CONFIG_PATH',
})
parser.addGroup(
  new Group('rss', 'RSS feed management').withCommand(
    new Command('list', 'List RSS feeds you are subscribed to')
      .withOption({
        key: 'active',
        description: 'Only show recently updated feeds',
        type: 'boolean',
        default: false,
      })
      .withOption({
        key: 'out-file',
        description: 'When specified, write output to this file',
        type: 'string',
      })
      .withOption({
        key: 'timeout-seconds',
        description: 'Maximum time spent waiting in seconds for each RSS feed to respond',
        type: 'number',
        default: 10,
      }),
  ),
)

it('should have all variations on sourcemap', async () => {
  process.env.RSS_CONFIG_PATH = '/home/user/rss'
  const context = await parser.parse(['rss', 'list', '--active'])
  expect(context).toHaveProperty('sourcemap')
  expect(context.sourcemap).toHaveProperty('rss-config-path', 'env')
  expect(context.sourcemap).toHaveProperty('active', 'explicit')
  expect(context.sourcemap).toHaveProperty('timeout-seconds', 'default')
  expect(context.sourcemap).not.toHaveProperty('out-file')
})

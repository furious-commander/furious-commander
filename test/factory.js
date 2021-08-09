const { createParser, Command, Group } = require('../src/parser')

function createSampleApp() {
  const parser = createParser()
  parser.addGlobalOption({
    key: 'quiet',
    description: 'Do not print to console',
    type: 'boolean',
    default: false,
    alias: 'q',
  })
  parser.addGlobalOption({
    key: 'verbose',
    description: 'Print debug messages to console',
    type: 'boolean',
    default: false,
    alias: 'v',
  })
  parser.addGlobalOption({
    key: 'help',
    description: 'Print context aware help and exit',
    type: 'boolean',
    default: false,
    alias: 'h',
  })
  parser.addGlobalOption({
    key: 'version',
    description: 'Print version and exit',
    type: 'boolean',
    default: false,
    alias: 'V',
    handler: () => {
      process.stdout.write('1.0.0\n')
    },
  })

  parser.addGlobalOption({
    key: 'config-dir',
    description: 'Application configuration directory',
    type: 'string',
    default: '/etc/cafe',
  })
  parser.addGlobalOption({
    key: 'api-host',
    description: 'Address of API',
    type: 'string',
    default: 'http://localhost:3000',
  })
  parser.addCommand(new Command('ping', 'Test connection to remote server'))
  parser.addGroup(
    new Group('auth', 'Authentication commands')
      .withCommand(
        new Command('login', 'Login with username and password')
          .withOption({ key: 'username', description: 'Username', type: 'string', required: true })
          .withOption({ key: 'password', description: 'Password', type: 'string', required: true }),
      )
      .withCommand(
        new Command('register', 'Login with username and password', null, { alias: 'reg' })
          .withOption({ key: 'email', description: 'Email', type: 'string', required: true })
          .withOption({ key: 'username', description: 'Username', type: 'string', required: true })
          .withOption({ key: 'password', description: 'Password', type: 'string', required: true }),
      ),
  )
  parser.addGroup(
    new Group('file', 'File upload and download commands')
      .withCommand(
        new Command('upload', 'Upload file at path with specific name', null, { alias: 'up' })
          .withPositional({ key: 'path', description: 'Path to file', type: 'string', required: true })
          .withOption({ key: 'name', description: 'Name of uploaded file', type: 'string', alias: 'n', required: true })
          .withOption({
            key: 'private',
            description: 'Whether upload file is private',
            type: 'boolean',
            default: false,
          }),
      )
      .withCommand(
        new Command('download', 'Download file by name', null, { alias: 'down' }).withPositional({
          key: 'name',
          description: 'Name of file to download',
          type: 'string',
          alias: 'n',
          required: true,
        }),
      ),
  )

  return parser
}

module.exports = { createSampleApp }

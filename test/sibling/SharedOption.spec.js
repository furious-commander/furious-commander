const { createParser, Command } = require('../../src/parser')

const parser = createParser()
parser.addCommand(
  new Command('download', 'N/A').withOption({
    key: 'name',
    description: 'N/A',
    type: 'string',
    required: true,
  }),
)
parser.addCommand(
  new Command('reupload', 'N/A', null, { sibling: 'download' }).withOption({
    key: 'name',
    description: 'N/A',
    type: 'string',
    required: true,
  }),
)

it('should set same option for both commands', async () => {
  const context = await parser.parse(['reupload', '--name', 'upload.png'])
  expect(context).toHaveProperty('options')
  expect(context.options).toHaveProperty('name', 'upload.png')
  expect(context).toHaveProperty('sibling')
  expect(context.sibling).toHaveProperty('options')
  expect(context.sibling.options).toHaveProperty('name', 'upload.png')
})

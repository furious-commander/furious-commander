import cli, { LeafCommand } from '../src'

class TestCommand implements LeafCommand {
  public name = 'test'
  public description = 'Test'

  run() {
    throw Error('Expected')
  }
}

describe('Error handler', () => {
  it('should invoke custom error handler', async () => {
    let caughtError = null
    await cli({
      rootCommandClasses: [TestCommand],
      testArguments: ['test'],
      errorHandler: error => {
        caughtError = error
      },
    })
    expect(caughtError).toHaveProperty('message', 'Expected')
  })

  it('should invoke default error handler', async () => {
    let caughtError = null
    await cli({
      rootCommandClasses: [TestCommand],
      testArguments: ['test'],
      printer: {
        print: () => {
          /* empty */
        },
        printHeading: () => {
          /* empty */
        },
        formatDim: () => '',
        formatImportant: () => '',
        printError: message => {
          caughtError = message
        },
        getGenericErrorMessage: () => '',
      },
    })
    expect(caughtError).toBe('Expected')
  })
})

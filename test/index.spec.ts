import cli from '../src'
import { TestCommand, TestCommand10, TestCommand4, TestCommand6, TestCommand8, TestCommand9 } from './test-commands'

describe('Test Command classes', () => {
  let consoleMessages: string[] = []

  beforeAll(() => {
    global.console.log = jest.fn((message) => {
      consoleMessages.push(message)
    })
    jest.spyOn(global.console, 'warn')
  })

  beforeEach(() => {
    //clear stored console messages
    consoleMessages = []
  })

  it('should run LeafCommand run method', async () => {
    const commandKey = 'testCommand9'
    const commandBuilder = await cli({
      rootCommandClasses: [TestCommand9],
      testArguments: [ commandKey ],
    })

    const command: TestCommand9 = commandBuilder.initedCommands[0].command as TestCommand9

    expect(command.name).toBe(commandKey)
    expect(consoleMessages[0]).toBe(`I'm the testCommand ${commandKey}`)
  })

  it('should set cli option of Command instance', async () => {
    const commandKey = 'testCommand8'
    const commandOptionValue = 'testOptionValue8'
    const commandBuilder = await cli({
      rootCommandClasses: [TestCommand8],
      testArguments: [ commandKey, '--option-test-command-8', commandOptionValue ],
    })
    const command: TestCommand8 = commandBuilder.initedCommands[0].command as TestCommand8

    expect(command.option1).toBe(commandOptionValue)
    expect(consoleMessages[0]).toBe(`I'm the testCommand ${commandKey}. option-test-command-8: ${commandOptionValue}`)
  })

  it('should set cli argument of Command instance', async () => {
    const commandArgumentValue = 'I COMMAND!!!!'
    const commandBuilder = await cli({
      rootCommandClasses: [TestCommand4],
      testArguments: [ 'testCommand4', commandArgumentValue ],
    })
    const command: TestCommand4 = commandBuilder.initedCommands[0].command as TestCommand4

    expect(command.argument1).toBe(commandArgumentValue)
  })

  it('should set externally defined cli option default value to Command instance\'s field', async () => {
    const optionValue = 'http://obeying-service.local'
    const optionKey = 'api-url'
    const commandBuilder = await cli({
      rootCommandClasses: [TestCommand6],
      testArguments: [ 'testCommand6' ],
      optionParameters: [
        {
          key: optionKey,
          describe: 'URL of the EP that I will Command!',
          default: optionValue,
        },
      ],
    })
    const command: TestCommand6 = commandBuilder.initedCommands[0].command as TestCommand6

    expect(command.apiUrl).toBe(optionValue)
  })

  it('should set passed externally defined cli option value to Command instance\'s field', async () => {
    const optionValue = 'http://obedient-service.local'
    const optionKey = 'api-url'
    const commandBuilder = await cli({
      rootCommandClasses: [TestCommand6],
      testArguments: [ 'testCommand6', `--${optionKey}`, optionValue ],
      optionParameters: [
        {
          key: optionKey,
          describe: 'URL of the EP that I will Command!',
        },
      ],
    })
    const command: TestCommand6 = commandBuilder.initedCommands[0].command as TestCommand6

    expect(command.apiUrl).toBe(optionValue)
  })

  it('should use GroupCommand and call one of its LeafCommand (depth: 3)', async () => {
    //also use alias of the rootCommand
    //also fetch parent command option in leaf command
    const testCommand3OptionValue = 'BUT DO LIKE IN OTHER WAY NOW!'
    const testCommand3OptionKey = 'option-test-command-3'
    const leafCommandName = 'testCommand9'
    const commandBuilder = await cli({
      rootCommandClasses: [TestCommand],
      testArguments: [ 'tst', `testCommand3`, leafCommandName, `--${testCommand3OptionKey}`, testCommand3OptionValue ],
    })
    const command: TestCommand9 = commandBuilder
      .initedCommands[0]
      .subCommands[0]
      .subCommands[1]
      .command as TestCommand9

      expect(consoleMessages[0]).toBe(`I'm the testCommand ${leafCommandName}`)
      expect(command.optionTestCommand3).toBe(testCommand3OptionValue)
  })

  it('should run async operation on command class then wait for it', async () => {
    const commandKey = 'testCommand10'
    const commandBuilder = await cli({
      rootCommandClasses: [TestCommand10],
      testArguments: [ commandKey ],
    })
    commandBuilder.initedCommands[0].command as TestCommand10

    expect(consoleMessages[0]).toBe(`I'm the testCommand ${commandKey}`)
  })
})

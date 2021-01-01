import cli from '../src'
import { TestCommand8 } from './test-commands'

describe('Test SubCommand run', () => {

  // it('should run testCommand8 run method', () => {
  //   const commandBuilder = cli({
  //     rootCommandClasses: [TestCommand8],
  //     testArguments: [ 'testCommand8' ],
  //   })

  //   const command: TestCommand8 = commandBuilder.initedCommands[0].command

  //   expect(command.option1).toBe(1)
  // })

  it('should set cli option to Command instance', () => {
    const commandOptionValue = 'testOptionValue8'
    const commandBuilder = cli({
      rootCommandClasses: [TestCommand8],
      testArguments: [ 'testCommand8', '--option-test-command-8', commandOptionValue ],
    })

    const command: TestCommand8 = commandBuilder.initedCommands[0].command as TestCommand8

    expect(command.option1).toBe(commandOptionValue)
  })
})

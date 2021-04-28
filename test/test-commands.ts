import { GroupCommand, LeafCommand, Argument, ExternalOption, Option, Aggregation } from '../src'
import { EitherOneParam } from '../src/command'

@EitherOneParam(['option1', 'option2'])
export class TestCommand13 implements LeafCommand {
  public readonly name = 'testCommand13'

  public readonly description = 'This is the testcommand13'

  @Option({ key: 'option1', describe: 'Test option1 for TestCommand13' })
  public option1!: string

  @Option({ key: 'option2', describe: 'Test option2 for TestCommand13' })
  public option2!: string

  public run(): void {
    console.log(`I'm the testCommand ${this.name}`)
    console.log(`Aggregated relation "option1" value: ${this.option1}`)
    console.log(`Aggregated relation "option2" value: ${this.option2}`)
  }
}

/** Has to be inited only via testCommand11 */
export class TestCommand12 implements LeafCommand {
  public readonly name = 'testCommand12'

  public readonly description = 'This is the testcommand12'

  @Aggregation(['testCommand11', 'testCommand4']) //'cause this ref
  public aggregatedRelation!: TestCommand4

  public run(): void {
    console.log(`I'm the testCommand ${this.name}`)
    console.log(`Aggregated relation "argument1" value: ${this.aggregatedRelation.argument1}`)
    console.log(`Aggregated relation "option1" value: ${this.aggregatedRelation.option1}`)
  }
}

export class TestCommand11 implements GroupCommand {
  public readonly name = 'testCommand11'

  public readonly description = 'This is the testcommand11'

  public subCommandClasses = [TestCommand4, TestCommand12]
}

export class TestCommand10 implements LeafCommand {
  public readonly name = 'testCommand10'

  public readonly description = 'This is the testcommand10'

  public async run(): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 50))

    return new Promise(resolve => {
      console.log(`I'm the testCommand ${this.name}`)
      resolve()
    })
  }
}

export class TestCommand9 implements LeafCommand {
  public readonly name = 'testCommand9'

  public readonly description = 'This is the testcommand9'

  @ExternalOption('option-test-command-3')
  public optionTestCommand3!: string

  public run(): void {
    console.log(`I'm the testCommand ${this.name}`)
  }
}

export class TestCommand8 implements LeafCommand {
  public readonly name = 'testCommand8'

  public readonly description = 'This is the testcommand8'

  @Option({ key: 'option-test-command-8', describe: 'Test option for TestCommand' })
  public option1!: string

  public run(): void {
    console.log(`I'm the testCommand ${this.name}. option-test-command-8: ${this.option1}`)
  }
}

export class TestCommand6 implements LeafCommand {
  public readonly name = 'testCommand6'

  public readonly description = 'This is the testcommand5'

  @ExternalOption('api-url')
  public apiUrl!: string

  public run(): void {
    console.log(`I'm the testCommand ${this.name}. apiUrl: ${this.apiUrl}`)
  }
}

export class TestCommand5 implements LeafCommand {
  public readonly name = 'testCommand5'

  public readonly description = 'This is the testcommand5'

  public run(): void {
    console.log(`I'm the testCommand ${this.name}`)
  }
}

export class TestCommand4 implements LeafCommand {
  @Option({ key: 'option-test-command-4', describe: 'test option for TestCommand4', type: 'boolean' })
  public option1!: boolean

  @Argument({ key: 'argument123123', describe: 'test argument for TestCommand4', required: true })
  public argument1!: string

  public readonly name = 'testCommand4'

  public readonly description = 'This is the TestCommand4'

  public run(): void {
    console.log(`I'm the testCommand ${this.name}`)
    console.log(`option-test-command-4 : ${this.option1}; argument123123: ${this.argument1}`)
  }
}

export class TestCommand3 implements GroupCommand {
  public readonly name = 'testCommand3'

  public subCommandClasses = [TestCommand4, TestCommand9]

  public readonly description = 'This is the testCommand3'

  @Option({ key: 'option-test-command-3', describe: 'option1 key for testCommand3' })
  public option1!: string
}

export class TestCommand implements GroupCommand {
  @Option({ key: 'test-command-option-1', describe: 'Test option for TestCommand' })
  public option1!: string
  public readonly name = 'testCommand'
  public readonly description = 'This is the TestCommand1'
  public readonly aliases = ['tst']
  public subCommandClasses = [TestCommand3, TestCommand5]
}

export class TestCommand7 implements GroupCommand {
  @Option({ key: 'option-test-command-7', describe: 'Test option for TestCommand7' })
  public vmi!: string
  public readonly name = 'TestCommand7'
  public readonly description = 'This is the testcommand7'
  public readonly aliases = ['tst7']
  public subCommandClasses = [TestCommand3, TestCommand5]
}

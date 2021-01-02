import { GroupCommand, LeafCommand, Argument, ExternalOption, Option } from '../src'

export class TestCommand9 implements LeafCommand {
  public readonly name = 'testCommand9'

  public readonly description = 'This is the testcommand9'

  public run(): void {
    console.log(`I'm the testCommand ${this.name}`)
  }
}

export class TestCommand8 implements LeafCommand {
  public readonly name = 'testCommand8'

  public readonly description = 'This is the testcommand8'

  @Option({ key: 'option-test-command-8', describe: 'Test option for TestCommand' })
  public option1!: string;

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

  @Argument({ key: 'argument123123', describe: 'test argument for TestCommand4', demandOption: true })
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
  public subCommandClasses = [TestCommand4, TestCommand6]

  public readonly description = 'This is the testCommand3'
}

export class TestCommand implements GroupCommand {
  @Option({ key: 'test-command-option-1', describe: 'Test option for TestCommand' })
  public option1!: string;
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

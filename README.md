# Furious Commander

This is a testable CLI framework, which uses [yargs](http://yargs.js.org/) and [decorators](https://www.typescriptlang.org/docs/handbook/decorators.html). It supports commands in any depth and provides decorators to easily define and use CLI `arguments` and `options`.

## Install

```sh
 $ npm install --save furious-commander
```

## Usage

You can create Command classes to construct the command tree, and assign functionalities.

Basically, there are two kind of Commands: `LeafCommand` and `GroupCommand`.
These are also available as interfaces, which can help you to implement the required fields and methods.

There is a sample in the [test/test-commands.ts](test/test-commands.ts) file how you can utilize the possibilities of this framework in your application. (This file also used in Jest tests)

An example of a leaf command:
```ts
import { Option, ExternalOption, Argument, LeafCommand } from 'furious-commander'

export class TestLeafCommand implements LeafCommand {
  public readonly name = 'testCommand'

  public readonly description = 'This is a testcommand'

  @Option({ key: 'option-test-command-1', describe: 'Test option 1 for TestLeafCommand' })
  public option1!: string

  @Argument({ key: 'argument-1', describe: 'test argument for TestLeafCommand', demandOption: true })
  public argument1!: string

  @ExternalOption('api-url')
  public apiUrl!: string

  @ExternalOption('group-option-1')
  public groupOption!: string

  public run(): void {
    console.log(`I'm ${this.name}. option-test-command-1: ${this.option1}.`)
    console.log(' I COMMAND!!!!!4!')
    // (...)
  }
}
```

and a group command:
```ts
import { Option, ExternalOption, Argument, GroupCommand } from 'furious-commander'

export class TestGroupCommand implements GroupCommand {
  public readonly name = 'testGroupCommand'

  public subCommandClasses = [TestLeafCommand]

  public readonly description = 'This is a GroupCommand'

  @Option({ key: 'group-option-1', describe: 'Test option 1 for export class TestGroupCommand' })
  public option1!: string
}
```

Other "root level" `options` and configuration of the CLI can be passed on the invocation of the `cli` method.
This method initializes all your passed root Command classes, until its last LeafCommands (and make it available for later) and configure `yargs` based on the passed configuration.
For this you can find example in [test/index.spec.ts](test/index.spec.ts)

example for `cli` method call with the command class above:

```ts
const commandBuilder = cli({
  rootCommandClasses: [TestGroupCommand],
  optionParameters: [
    {
      key: 'api-url',
      describe: 'URL of the EP that I will Command!',
      default: 'http://obedient-service.local',
    },
  ],
})
```

## Setup your project

In order to use decorators in your project (until it's not available in vanilla JS) you should use `typescript` with the following configuration:

```JSON
{
  "compilerOptions": {
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true,
    // (...)
  }
  // (...)
}
```

For babel use `@babel/plugin-proposal-decorators` (suggested with `legacy: true`) followed by `@babel/plugin-proposal-class-properties` plugins.

## Test

```sh
 $ npm run test
```

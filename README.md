# Furious Commander

Furious Commander is a testable CLI framework, which uses [decorators](https://www.typescriptlang.org/docs/handbook/decorators.html) and classes to specify commands in any depth and easily define and use CLI `arguments` and `options`.

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

  @Argument({ key: 'argument-1', describe: 'test argument for TestLeafCommand', required: true })
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
This method initializes all your passed root Command classes, until its last LeafCommands (and make it available for later).
For this you can find example in [test/index.spec.ts](test/index.spec.ts)

example for `cli` method call with the command class above:

```ts
const commandBuilder = await cli({
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

Through the `commandBuilder` object, the initialized classes are reachable.

If you build successfully your cli project (e.g. `#!/usr/bin/env node` presents at the top of the source file...) You can call the command with the setup above:

```sh
 $ <your-cli-app> testGroupCommand testCommand testargument --api-url http://localhost:8080
```

This will invoke the testCommand's (async) `run` method, after its fields initialized by Furious Commander.

### Aggregation

The framework support aggregated relations between independent commands.
It means, one command is able to reach the properties of other command.
The configurations of the referenced aggregated command will be applied to the base class, that defines the relation.
In order to build up this relation, an arbitrary field of the class has to be decorated with `Aggregation`.

A sample class to show how it is possible
```ts
import { Aggregation } from 'furious-commander'

export class TestCommand {

  @Aggregation(['group-command', 'furious-command']) // CLI path of the referenced Command
  public aggregatedRelation!: FuriousCommand // Type in here the class of the aggregated command

  // (...)
}
```
By this, `TestCommand` can invoke any function of `FuriousCommand`, and `FuriousCommand` all Options and Arguments have been initialized by the framework.
Of course, all required parameters of aggregated relations have to be defined in the CLI call.
For instance, `FuriousCommand` has required argument `argument-1`, when calling `TestCommand`, `argument-1` has to be passed as well even if it is not defined directly in `TestCommand`.

You can see this functionality in action on test `should reach aggregated command fields`.

### Command Class Decorators

You can define decorator on command class definition, which applies globally contrains on the class' arguments and options.

#### Allow only either one param

It is possible to allow only one parameter of the given option/argument key set.
This key set consists required parameters for the successful run, but only one of them has to be defined.

```ts
export class TestCommand13 implements LeafCommand {
  public readonly name = 'testCommand13'

  public readonly description = 'This is the testcommand13'

  @Option({ key: 'option1', describe: 'Test option1 for TestCommand13', required: true, conflicts: 'option2' })
  public option1!: string;

  @Option({ key: 'option2', describe: 'Test option2 for TestCommand13', required: true, conflicts: 'option1' })
  public option2!: string;

  public run(): void {
    // (...)
  }
}
```

By this setup I cannot call `TestCommand13` with both options `option1` and `option2`, but I have to pass at least one of these.

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

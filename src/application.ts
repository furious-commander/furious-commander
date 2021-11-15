export interface Application {
  name: string
  command: string
  version: string
  description: string
  /**
   * Determines how the end user can generate autocompletion scripts.
   *
   * `fromOption`: Adds a global option: `--generate-completion`
   *
   * `fromCommand`: Adds a top level command: `generate-completion`
   */
  autocompletion?: 'fromOption' | 'fromCommand' | 'disabled'
}

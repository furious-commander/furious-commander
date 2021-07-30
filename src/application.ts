export interface Application {
  name: string
  command: string
  version: string
  description: string
  autocompletion?: 'options' | 'commands' | 'disabled'
}

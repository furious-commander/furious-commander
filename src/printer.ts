export interface Printer {
  print(text: string): void
  printError(text: string): void
  printHeading(text: string): void
  formatDim(text: string): string
  formatImportant(text: string): string
  getGenericErrorMessage(): string
}

export function createDefaultPrinter(): Printer {
  return {
    print: text => console.log(text),
    printError: text => console.error(text),
    printHeading: text => console.log(text),
    formatDim: text => text,
    formatImportant: text => text,
    getGenericErrorMessage: () => 'Failed to run command!',
  }
}

export interface Printer {
  print(text: string): void;
  printError(text: string): void;
  printHeading(text: string): void;
  formatImportant(text: string): string;
  getGenericErrorMessage(): string;
}

export function createDefaultPrinter(): Printer {
  return {
    print: (text) => console.log(text),
    printError: (text) => console.error(text),
    printHeading: (text) => console.log(text),
    formatImportant: (text) => text,
    getGenericErrorMessage: () => "Failed to run command!",
  };
}

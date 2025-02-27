export interface ProcessEnv {
  [key: string]: string;
}

export interface ClassConstructor {
  new (...args: any[]): object;
}

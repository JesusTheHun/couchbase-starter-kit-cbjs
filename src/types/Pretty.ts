export type Pretty<T> = {
  [Key in keyof T]: T[Key];
} & NonNullable<unknown>;

export {};

declare global {
  type Result<T> =
    | {
        error?: never;
        result: T;
      }
    | {
        error: string;
        result?: never;
      };
}

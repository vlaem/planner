declare module "vitest" {
  export interface ProvidedContext {
    databaseUrl: string;
  }
}

// mark this file as a module so augmentation works correctly
export {};

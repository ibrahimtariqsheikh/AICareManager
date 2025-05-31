declare module 'zod' {
  export * from 'zod';
  export const z: {
    object: (schema: any) => any;
    string: () => any;
    enum: (values: readonly [string, ...string[]]) => any;
    boolean: () => any;
  };
} 
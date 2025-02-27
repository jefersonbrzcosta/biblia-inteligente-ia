declare module "sentence-transformers" {
  export function pipeline(
    task: string,
    model: string
  ): (input: string) => Promise<number[]>;
}

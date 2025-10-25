declare module '@zama-fhe/relayer-sdk/web' {
  interface FhevmInstance {
    encrypt8: (value: string | number) => any;
    encrypt16?: (value: string | number) => any;
    encrypt32?: (value: string | number) => any;
    encrypt64?: (value: string | number) => any;
  }

  export function createInstance(): Promise<FhevmInstance>;
}

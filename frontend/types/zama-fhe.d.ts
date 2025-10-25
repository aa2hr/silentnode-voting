declare module '@zama-fhe/relayer-sdk/web' {
  interface FhevmInstance {
    encrypt8: (value: string | number) => any;
    encrypt16?: (value: string | number) => any;
    encrypt32?: (value: string | number) => any;
    encrypt64?: (value: string | number) => any;
  }

  export function createInstance(config?: {
    chainId?: number;
    relayerUrl?: string;
    verifyingContractAddressDecryption?: string;
    verifyingContractAddressInputVerification?: string;
    kmsContractAddress?: string;
    inputVerifierContractAddress?: string;
    aclContractAddress?: string;
    gatewayChainId?: number;
    network?: any;
    [key: string]: any;
  }): Promise<FhevmInstance>;
} // Add this closing brace

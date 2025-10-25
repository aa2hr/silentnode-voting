interface EthereumProvider {
  request: (args: { method: string; params?: any[] | Record<string, any> }) => Promise<any>;
}

interface Window {
  ethereum?: EthereumProvider;
}

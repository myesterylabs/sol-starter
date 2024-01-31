export type SolanaConfig = {
  configFile: string;
  rpcUrl: string;
  webSocketUrl: string; // Computed, not provided in the input
  keypairPath: string;
  commitment: 'confirmed'; // Assuming commitment is always 'confirmed'
};

export type SavedStore = {
  foo: number;
  bar: string;
  json_rpc_url: string;
  ws_url: string;
  accounts?: Array<FileSystemWallet>;
}

export type FileSystemWallet = {
  name: string;
  path: string;
  recoveryPhrase: string;
  created_at: string;
  publicKey: string;
}

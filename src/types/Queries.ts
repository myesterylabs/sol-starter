export enum Queries {
  GET_EXPECTED_PATH = 'GET_EXPECTED_PATH'
}

export type Query = {
  query: Queries
  channel: string
  async: boolean
}

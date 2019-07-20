export type FileVersions = {
  readonly [path: string]: number
}

export type EngineFile = {
  readonly path: string
  readonly name: string
  readonly extension: string
}

export type GameFile = {
  readonly path: string
  readonly game: string
  readonly name: string
  readonly extension: string
}

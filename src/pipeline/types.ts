export type FileVersions = {
  readonly [path: string]: number
}

export type FileChangeHandler = (
  fileVersions: FileVersions
) => Promise<void>

import * as recursiveReaddir from "recursive-readdir"
import * as types from "../../types"
import isMonitored from "./is-monitored"

export default async function (): Promise<types.FileVersions> {
  const output: { [path: string]: number } = {}

  const files = await recursiveReaddir(`src`)
  files
    .filter(isMonitored)
    .forEach(file => output[file] = 0)

  return output
}

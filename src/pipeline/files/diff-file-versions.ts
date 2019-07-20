import * as types from "../types"
import Diff from "./diff"

export default function (
  previousFileVersions: types.FileVersions,
  nextFileVersions: types.FileVersions
): Diff<string> {
  const previousKeys = Object.keys(previousFileVersions)
  const nextKeys = Object.keys(nextFileVersions)
  const commonKeys = previousKeys.filter(key => nextKeys.includes(key))
  return new Diff<string>(
    nextKeys.filter(key => !previousKeys.includes(key)),
    commonKeys.filter(key => previousFileVersions[key] !== nextFileVersions[key]),
    previousKeys.filter(key => !nextKeys.includes(key)),
    commonKeys.filter(key => previousFileVersions[key] === nextFileVersions[key])
  )
}

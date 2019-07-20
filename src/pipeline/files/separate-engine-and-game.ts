import * as types from "../types"
import Diff from "./diff"

function assembleName(
  pathExcludingExtension: string,
  extension: string
): string {
  return pathExcludingExtension
    .split(/[\\\/]/g)
    .slice(1)
    .concat(extension)
    .map(
      segment => {
        const runs = segment.split(/[-\.]/g)
        return runs
          .slice(0, 1)
          .concat(
            runs
              .slice(1)
              .map(run => `${run.charAt(0).toUpperCase()}${run.slice(1)}`)
          )
          .join(``)
      }
    )
    .join(`_`)
}

export default function (
  diff: Diff<string>,
  debug: boolean
): {
  readonly engine: Diff<types.EngineFile>
  readonly game: Diff<types.GameFile>
} {
  const typeSeparated = diff.separate({
    engine: path => {
      const match = /^src[\\\/]engine((?:[\\\/](?:[a-z][a-z0-9-]*[a-z0-9]|[a-z]))+)\.([a-z\.]*[a-z])$/
        .exec(path)
      if (match === null) {
        return null
      } else {
        return {
          path,
          name: assembleName(match[1], match[2]),
          extension: match[2]
        }
      }
    },
    game: path => {
      const match = /^src[\\\/]games[\\\/]([a-z]|[a-z][a-z0-9-]{0,48}[a-z0-9])((?:[\\\/](?:[a-z][a-z0-9-]*[a-z0-9]|[a-z]))+)\.([a-z\.]*[a-z])$/
        .exec(path)
      if (match === null) {
        return null
      } else {
        return {
          path,
          game: match[1],
          name: assembleName(match[2], match[3]),
          extension: match[3]
        }
      }
    }
  })

  const unsortedAddedOrUpdated = typeSeparated.unsorted.added
    .concat(typeSeparated.unsorted.updated)
  if (unsortedAddedOrUpdated.length > 0) {
    const message = `The following paths were not recognized: ${
      unsortedAddedOrUpdated
        .map(path => `\n\t${JSON.stringify(path)}`)
        .join(``)
      }`
    if (debug) {
      console.error(message)
    } else {
      throw new Error(message)
    }
  }

  return typeSeparated.sortedByKey
}

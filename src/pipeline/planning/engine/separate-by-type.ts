import * as types from "../../types"
import Diff from "../../files/diff"

export default function (
  debug: boolean,
  engineDiff: Diff<types.EngineFile>
): {
  readonly sortedByKey: {
    readonly typeScript: Diff<types.EngineFile>
    readonly pug: Diff<types.EngineFile>
  }
} {
  const typeSeparated = engineDiff.separate({
    typeScript: file => [`ts`, `d.ts`].includes(file.extension) ? file : null,
    pug: file => file.name === `index_pug` ? file : null
  })

  const unsortedAddedOrUpdated = typeSeparated.unsorted.added
    .concat(typeSeparated.unsorted.updated)
  if (unsortedAddedOrUpdated.length > 0) {
    const message = `The following engine paths were not recognized: ${
      unsortedAddedOrUpdated
        .map(path => `\n\t${JSON.stringify(path.path)}`)
        .join(``)
      }`
    if (debug) {
      console.error(message)
    } else {
      throw new Error(message)
    }
  }

  return typeSeparated
}

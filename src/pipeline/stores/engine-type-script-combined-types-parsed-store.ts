import * as typeScript from "typescript"
import ValueStore from "./value-store"

export default new ValueStore<typeScript.SourceFile>(
  `engineTypeScriptCombinedTypesParsed`
)

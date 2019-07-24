import * as typeScript from "typescript"
import KeyValueStore from "./key-value-store"

export default new KeyValueStore<typeScript.SourceFile>(
  `gameNameTypeScriptParsed`
)

import * as typeScript from "typescript"
import KeyPairValueStore from "./key-pair-value-store";

export default new KeyPairValueStore<typeScript.SourceFile>(
  `gameSvgTypeScriptParsed`
)

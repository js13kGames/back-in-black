import * as path from "path"
import * as types from "../../types"
import Diff from "../../files/diff"
import StepBase from "../../steps/step-base"
import DeleteFromKeyPairValueStoreIfSetStep from "../../steps/actions/stores/delete-from-key-pair-value-store-if-set-step"
import ReadTextFileStep from "../../steps/actions/files/read-text-file-step"
import ParseTypeScriptStep from "../../steps/actions/type-script/parse-type-script-step"
import gameTypeScriptTextStore from "../../stores/game-type-script-text-store"
import gameTypeScriptParsedStore from "../../stores/game-type-script-parsed-store"

function generateTypeScriptPath(file: types.EngineFile): string {
  return path.join(`game`, `${file.name}.${file.extension}`)
}

export default function (
  typeScriptDiff: Diff<types.GameFile>
): StepBase {
  return typeScriptDiff.generateSteps(
    `typeScript`,
    false,
    item => item.name,
    item => [
      new DeleteFromKeyPairValueStoreIfSetStep(
        gameTypeScriptTextStore, item.game, generateTypeScriptPath(item)
      ),
      new DeleteFromKeyPairValueStoreIfSetStep(
        gameTypeScriptParsedStore, item.game, generateTypeScriptPath(item)
      )
    ],
    item => [
      new ReadTextFileStep(
        item.path,
        text => gameTypeScriptTextStore.set(
          item.game, generateTypeScriptPath(item), text
        )
      ),
      new ParseTypeScriptStep(
        generateTypeScriptPath(item),
        () => gameTypeScriptTextStore.get(
          item.game, generateTypeScriptPath(item)
        ),
        parsed => gameTypeScriptParsedStore.set(
          item.game, generateTypeScriptPath(item), parsed
        )
      )
    ]
  )
}

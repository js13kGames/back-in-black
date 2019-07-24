import * as path from "path"
import keyValueObject from "../../utilities/key-value-object"
import * as types from "../../types"
import Diff from "../../files/diff"
import StepBase from "../../steps/step-base"
import DeleteFromKeyValueStoreIfSetStep from "../../steps/actions/stores/delete-from-key-value-store-if-set-step"
import CombineTypeScriptStep from "../../steps/actions/type-script/combine-type-script-step"
import ParseUglifyJsStep from "../../steps/actions/uglify-js/parse-step"
import CombineUglifyJsStep from "../../steps/actions/uglify-js/combine-step"
import gameNameTypeScriptParsedStore from "../../stores/game-name-type-script-parsed-store"
import gameTypeScriptCombinedJavascriptTextStore from "../../stores/game-type-script-combined-javascript-text-store"
import gameTypeScriptCombinedJavascriptParsedStore from "../../stores/game-type-script-combined-javascript-parsed-store"
import gameJavascriptStore from "../../stores/game-javascript-store"
import engineTypeScriptCombinedTypesParsedStore from "../../stores/engine-type-script-combined-types-parsed-store"
import gameSvgTypeScriptParsedStore from "../../stores/game-svg-type-script-parsed-store"
import gameTypeScriptParsedStore from "../../stores/game-type-script-parsed-store"
import engineTypeScriptCombinedJavascriptParsedStore from "../../stores/engine-type-script-combined-javascript-parsed-store"

export default function (
  enginePlanningResult: types.EnginePlanningResult,
  allSorted: Diff<types.GameFile>
): StepBase {
  return allSorted
    .mapItems(item => item.game)
    .deduplicateItems()
    .generateSteps(
      `javascriptGeneration`,
      enginePlanningResult.allGamesRequireJavascriptRegeneration,
      item => item,
      item => [
        new DeleteFromKeyValueStoreIfSetStep(
          gameTypeScriptCombinedJavascriptTextStore, item
        ),
        new DeleteFromKeyValueStoreIfSetStep(
          gameTypeScriptCombinedJavascriptParsedStore, item
        ),
        new DeleteFromKeyValueStoreIfSetStep(gameJavascriptStore, item)
      ],
      item => [
        new CombineTypeScriptStep(
          () => [
            keyValueObject(
              `engine.d.ts`, engineTypeScriptCombinedTypesParsedStore.get()
            ),
            keyValueObject(
              path.join(`.generated-type-script`, `game-name.ts`),
              gameNameTypeScriptParsedStore.get(item)
            ),
            gameSvgTypeScriptParsedStore.tryGetAllByBaseKey(item),
            gameTypeScriptParsedStore.tryGetAllByBaseKey(item)
          ],
          javascript => gameTypeScriptCombinedJavascriptTextStore.set(
            item, javascript
          ),
          types => { }
        ),
        new ParseUglifyJsStep(
          () => gameTypeScriptCombinedJavascriptTextStore.get(item),
          parsed => gameTypeScriptCombinedJavascriptParsedStore.set(
            item, parsed
          )
        ),
        new CombineUglifyJsStep(
          () => [
            engineTypeScriptCombinedJavascriptParsedStore.get(),
            gameTypeScriptCombinedJavascriptParsedStore.get(item)
          ],
          combined => gameJavascriptStore.set(item, combined)
        )
      ]
    )
}

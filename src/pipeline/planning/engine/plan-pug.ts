import * as types from "../../types"
import Diff from "../../files/diff"
import StepBase from "../../steps/step-base"
import DeleteFromValueStoreIfSetStep from "../../steps/actions/stores/delete-from-value-store-if-set-step"
import ParsePugStep from "../../steps/actions/pug/parse-pug-step"
import enginePugStore from "../../stores/engine-pug-store"

export default function (
  pugDiff: Diff<types.EngineFile>
): StepBase {
  return pugDiff.generateSteps(
    `pug`,
    false,
    item => item.name,
    item => [new DeleteFromValueStoreIfSetStep(enginePugStore)],
    item => [
      new ParsePugStep(
        item.path,
        parsed => enginePugStore.set(parsed)
      )
    ]
  )
}

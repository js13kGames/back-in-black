import * as path from "path"
import * as types from "../../types"
import Diff from "../../files/diff"
import StepBase from "../../steps/step-base"
import SerialStep from "../../steps/aggregators/serial-step"
import DeleteFromKeyValueStoreIfSetStep from "../../steps/actions/stores/delete-from-key-value-store-if-set-step"
import ReadTextFileStep from "../../steps/actions/files/read-text-file-step"
import ParseTypeScriptStep from "../../steps/actions/type-script/parse-type-script-step"
import CombineTypeScriptStep from "../../steps/actions/type-script/combine-type-script-step"
import engineTypeScriptTextStore from "../../stores/engine-type-script-text-store"
import engineTypeScriptParsedStore from "../../stores/engine-type-script-parsed-store"

export default function (
  typeScriptDiff: Diff<types.EngineFile>
): StepBase {
  function generateTypeScriptPath(file: types.EngineFile): string {
    return path.join(`engine`, `${file.name}.${file.extension}`)
  }

  const typeScriptFileSteps = typeScriptDiff.generateSteps(
    `files`,
    false,
    item => item.name,
    item => [
      new DeleteFromKeyValueStoreIfSetStep(
        engineTypeScriptTextStore, generateTypeScriptPath(item)
      ),
      new DeleteFromKeyValueStoreIfSetStep(
        engineTypeScriptParsedStore, generateTypeScriptPath(item)
      )
    ],
    item => [
      new ReadTextFileStep(
        item.path,
        text => engineTypeScriptTextStore.set(generateTypeScriptPath(item), text)
      ),
      new ParseTypeScriptStep(
        generateTypeScriptPath(item),
        () => engineTypeScriptTextStore.get(generateTypeScriptPath(item)),
        parsed => engineTypeScriptParsedStore.set(generateTypeScriptPath(item), parsed)
      )
    ]
  )

  const steps: StepBase[] = [typeScriptFileSteps]

  if (typeScriptDiff.requiresGenerate()) {
    steps.push(
      new CombineTypeScriptStep(
        () => [engineTypeScriptParsedStore.getAll()],
        () => { },
      ),
    )
  }

  return new SerialStep(
    `typeScript`,
    steps
  )
}

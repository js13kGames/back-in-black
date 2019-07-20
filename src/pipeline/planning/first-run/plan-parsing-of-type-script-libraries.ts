import StepBase from "../../steps/step-base"
import SerialStep from "../../steps/aggregators/serial-step"
import ParallelStep from "../../steps/aggregators/parallel-step"
import ReadTextFileStep from "../../steps/actions/files/read-text-file-step"
import ParseTypeScriptStep from "../../steps/actions/type-script/parse-type-script-step"
import libraryTypeScriptTextStore from "../../stores/library-type-script-text-store"
import libraryTypeScriptParsedStore from "../../stores/library-type-script-parsed-store"

export default function (): StepBase {
  return new ParallelStep(
    `parseTypeScriptLibraries`,
    [
      `dom`,
      `es5`,
      `scripthost`
    ]
      .map(name => {
        const path = require.resolve(`typescript/lib/lib.${name}.d.ts`)
        return new SerialStep(name, [
          new ReadTextFileStep(
            path,
            text => libraryTypeScriptTextStore.set(path, text)
          ),
          new ParseTypeScriptStep(
            path,
            () => libraryTypeScriptTextStore.get(path),
            parsed => libraryTypeScriptParsedStore.set(path, parsed)
          )
        ])
      })
  )
}

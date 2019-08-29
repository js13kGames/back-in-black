import * as path from "path"
import * as types from "../../types"
import Diff from "../../files/diff"
import StepBase from "../../steps/step-base"
import SerialStep from "../../steps/aggregators/serial-step"
import ParallelStep from "../../steps/aggregators/parallel-step"
import ArbitraryStep from "../../steps/actions/arbitrary-step"
import DeleteFromKeyPairValueStoreIfSetStep from "../../steps/actions/stores/delete-from-key-pair-value-store-if-set-step"
import DeleteStep from "../../steps/actions/files/delete-step"
import WriteFileStep from "../../steps/actions/files/write-file-step"
import ReadTextFileStep from "../../steps/actions/files/read-text-file-step"
import ParseTypeScriptStep from "../../steps/actions/type-script/parse-type-script-step"
import OptimizeSvgStep from "../../steps/actions/optimize-svg-step"
import gameSvgTextStore from "../../stores/game-svg-text-store"
import gameSvgOptimizedStore from "../../stores/game-svg-optimized-store"
import gameSvgTypeScriptTextStore from "../../stores/game-svg-type-script-text-store"
import gameSvgTypeScriptParsedStore from "../../stores/game-svg-type-script-parsed-store"

function generateSvgPath(file: types.GameFile): string {
  return path.join(`.generated-type-script`, `${file.name}.ts`)
}

export default function (
  svgDiff: Diff<types.GameFile>
): StepBase {
  return svgDiff.generateSteps(
    `svg`,
    false,
    item => item.name,
    item => [
      new DeleteFromKeyPairValueStoreIfSetStep(
        gameSvgTextStore, item.game, generateSvgPath(item)
      ),
      new DeleteFromKeyPairValueStoreIfSetStep(
        gameSvgOptimizedStore, item.game, generateSvgPath(item)
      ),
      new DeleteFromKeyPairValueStoreIfSetStep(
        gameSvgTypeScriptTextStore, item.game, generateSvgPath(item)
      ),
      new DeleteFromKeyPairValueStoreIfSetStep(
        gameSvgTypeScriptParsedStore, item.game, generateSvgPath(item)
      ),
      new DeleteStep(
        path.join(`src`, `games`, item.game, `src`, `.generated-type-script`, `${item.name}.ts`)
      )
    ],
    item => [
      new ReadTextFileStep(
        item.path,
        text => gameSvgTextStore.set(item.game, generateSvgPath(item), text)
      ),
      new OptimizeSvgStep(
        () => gameSvgTextStore.get(item.game, generateSvgPath(item)),
        optimized => gameSvgOptimizedStore.set(
          item.game, generateSvgPath(item), optimized
        )
      ),
      new ArbitraryStep(
        `generateTypeScript`,
        async () => {
          const text = gameSvgOptimizedStore.get(item.game, generateSvgPath(item))
          const match = /^<svg width="(\d+)" height="(\d+)"><(.*)><\/svg>$/.exec(text)
          if (match === null) {
            throw new Error(
              `Failed to find root element in SVG ${JSON.stringify(text)}.`
            )
          }

          const typeScript = `const ${item.name}: EngineSpritesSvg = [${match[1]}, ${match[2]}, ${JSON.stringify(match[3])}]`
          gameSvgTypeScriptTextStore.set(item.game, generateSvgPath(item), typeScript)
        }
      ),
      new ParallelStep(
        `parseAndWrite`,
        [
          new ParseTypeScriptStep(
            generateSvgPath(item),
            () => gameSvgTypeScriptTextStore.get(item.game, generateSvgPath(item)),
            parsed => gameSvgTypeScriptParsedStore.set(item.game, generateSvgPath(item), parsed)
          ),
          new SerialStep(
            `write`,
            [
              new WriteFileStep(
                () => gameSvgTypeScriptTextStore.get(item.game, generateSvgPath(item)),
                path.join(`src`, `games`, item.game, `src`, `.generated-type-script`, `${item.name}.ts`)
              )
            ]
          )
        ]
      )
    ]
  )
}

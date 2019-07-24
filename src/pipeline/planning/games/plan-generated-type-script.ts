import * as path from "path"
import Diff from "../../files/diff"
import StepBase from "../../steps/step-base"
import SerialStep from "../../steps/aggregators/serial-step"
import ParallelStep from "../../steps/aggregators/parallel-step"
import ArbitraryStep from "../../steps/actions/arbitrary-step"
import DeleteFromKeyValueStoreIfSetStep from "../../steps/actions/stores/delete-from-key-value-store-if-set-step"
import DeleteStep from "../../steps/actions/files/delete-step"
import CreateFolderStep from "../../steps/actions/files/create-folder-step"
import WriteFileStep from "../../steps/actions/files/write-file-step"
import ParseTypeScriptStep from "../../steps/actions/type-script/parse-type-script-step"
import gameNameTypeScriptTextStore from "../../stores/game-name-type-script-text-store"
import gameNameTypeScriptParsedStore from "../../stores/game-name-type-script-parsed-store"

export default function (
  games: Diff<string>
): StepBase {
  const additions: ReadonlyArray<StepBase> = games
    .added
    .map(game => new SerialStep(
      game,
      [
        new ArbitraryStep(
          `generateTypeScript`,
          async () => gameNameTypeScriptTextStore.set(
            game, `const gameName = ${JSON.stringify(game)}`
          )
        ),
        new ParallelStep(
          `parseAndWrite`,
          [
            new ParseTypeScriptStep(
              path.join(`.generated-type-script`, `game-name.ts`),
              () => gameNameTypeScriptTextStore.get(game),
              parsed => gameNameTypeScriptParsedStore.set(game, parsed)
            ),
            new SerialStep(
              `write`,
              [
                new CreateFolderStep(
                  path.join(`src`, `games`, game, `src`, `.generated-type-script`)
                ),
                new WriteFileStep(
                  () => gameNameTypeScriptTextStore.get(game),
                  path.join(`src`, `games`, game, `src`, `.generated-type-script`, `game-name.ts`)
                )
              ]
            )
          ]
        )
      ]
    ))

  const deletionFolderRemovals: ReadonlyArray<StepBase> = games
    .deleted
    .map(game => new DeleteStep(
      path.join(`src`, `games`, game, `src`, `.generated-type-script`)
    ))

  const deletionGameNameTypeScriptTextStoreRemovals: ReadonlyArray<StepBase> = games
    .deleted
    .map(game => new DeleteFromKeyValueStoreIfSetStep(
      gameNameTypeScriptTextStore,
      game
    ))

  const deletionGameNameTypeScriptParsedStoreRemovals: ReadonlyArray<StepBase> = games
    .deleted
    .map(game => new DeleteFromKeyValueStoreIfSetStep(
      gameNameTypeScriptParsedStore,
      game
    ))

  return new ParallelStep(
    `generatedTypescript`,
    additions
      .concat(deletionFolderRemovals)
      .concat(deletionGameNameTypeScriptTextStoreRemovals)
      .concat(deletionGameNameTypeScriptParsedStoreRemovals)
  )
}

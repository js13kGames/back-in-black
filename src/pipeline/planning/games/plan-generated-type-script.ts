import * as path from "path"
import Diff from "../../files/diff"
import StepBase from "../../steps/step-base"
import ParallelStep from "../../steps/aggregators/parallel-step"
import DeleteStep from "../../steps/actions/files/delete-step"
import CreateFolderStep from "../../steps/actions/files/create-folder-step"

export default function (
  games: Diff<string>
): StepBase {
  const additions: ReadonlyArray<StepBase> = games
    .added
    .map(game => new CreateFolderStep(
      path.join(`src`, `games`, game, `src`, `.generated-type-script`)
    ))

  const deletions: ReadonlyArray<StepBase> = games
    .deleted
    .map(game => new DeleteStep(
      path.join(`src`, `games`, game, `src`, `.generated-type-script`)
    ))

  return new ParallelStep(
    `generatedTypescript`,
    additions.concat(deletions)
  )
}

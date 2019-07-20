import * as path from "path"
import StepBase from "../../steps/step-base"
import ParallelStep from "../../steps/aggregators/parallel-step"
import DeleteStep from "../../steps/actions/files/delete-step"

export default function (): StepBase {
  return new ParallelStep(
    `deletePreviousArtifacts`,
    [
      [`src`, `games`, `*`, `tsconfig.json`],
      [`src`, `games`, `*`, `.generated-type-script`],
      [`dist`]
    ].map(pathSegments => new DeleteStep(path.join.apply(path, pathSegments)))
  )
}

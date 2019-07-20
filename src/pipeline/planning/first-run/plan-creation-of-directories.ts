import * as path from "path"
import StepBase from "../../steps/step-base"
import ParallelStep from "../../steps/aggregators/parallel-step"
import CreateFolderStep from "../../steps/actions/files/create-folder-step"

export default function (): StepBase {
  return new ParallelStep(`createDirectories`, [
    [`dist`]
  ].map(pathSegments => new CreateFolderStep(
    path.join.apply(path, pathSegments))
  ))
}

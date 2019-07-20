import mkdirpPromise = require("mkdirp-promise")
import StepBase from "../../step-base"
import ActionStepBase from "../action-step-base"

export default class CreateFolderStep extends ActionStepBase {
  constructor(
    private readonly path: string
  ) {
    super(
      `createFolder`,
      [{
        key: `path`,
        value: path
      }],
      (self: StepBase) => []
    )
  }

  async execute(): Promise<void> {
    await mkdirpPromise(this.path)
  }
}

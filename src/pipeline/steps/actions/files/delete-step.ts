import * as rmfr from "rmfr"
import StepBase from "../../step-base"
import ActionStepBase from "../action-step-base"

export default class DeleteStep extends ActionStepBase {
  constructor(
    private readonly pattern: string
  ) {
    super(
      `delete`,
      [{
        key: `pattern`,
        value: pattern
      }],
      (self: StepBase) => []
    )
  }

  async execute(): Promise<void> {
    await rmfr(this.pattern, { glob: {} })
  }
}

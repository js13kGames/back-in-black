import * as pug from "pug"
import StepBase from "../../step-base"
import ActionStepBase from "../action-step-base"

export default class ParsePugStep extends ActionStepBase {
  constructor(
    private readonly fromPath: string,
    private readonly storeResult: (parsed: pug.compileTemplate) => void
  ) {
    super(
      `parsePug`,
      [{
        key: `fromPath`,
        value: fromPath
      }],
      (self: StepBase) => []
    )
  }

  async execute(): Promise<void> {
    this.storeResult(pug.compileFile(this.fromPath))
  }
}

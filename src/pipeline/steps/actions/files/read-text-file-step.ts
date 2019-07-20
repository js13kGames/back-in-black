import * as fs from "fs"
import StepBase from "../../step-base"
import ActionStepBase from "../action-step-base"

export default class ReadTextFileStep extends ActionStepBase {
  constructor(
    private readonly fromPath: string,
    private readonly storeResult: (text: string) => void
  ) {
    super(
      `readTextFile`,
      [{
        key: `fromPath`,
        value: fromPath
      }],
      (self: StepBase) => []
    )
  }

  async execute(): Promise<void> {
    this.storeResult(await fs.promises.readFile(this.fromPath, `utf8`))
  }
}

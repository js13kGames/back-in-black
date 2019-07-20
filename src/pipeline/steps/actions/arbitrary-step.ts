import StepBase from "../step-base"
import ActionStepBase from "./action-step-base"

export default class ArbitraryStep extends ActionStepBase {
  constructor(
    name: string,
    private readonly callback: () => Promise<void>
  ) {
    super(
      name,
      [],
      (self: StepBase) => []
    )
  }

  async execute(): Promise<void> {
    await this.callback()
  }
}

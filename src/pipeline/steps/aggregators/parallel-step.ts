import StepBase from "../../steps/step-base"
import ActionStepBase from "../../steps/actions/action-step-base"
import AggregatorStepBase from "./aggregator-step-base"

export default class ParallelStep extends AggregatorStepBase {
  constructor(
    name: string,
    children: ReadonlyArray<StepBase>
  ) {
    super(
      `${name} (parallel)`,
      [],
      (self: StepBase) => children.map(child => ({
        from: self,
        to: child,
        type: `strong`
      })),
      children
    )
  }

  async executePerActionStep(
    onActionStep: (
      step: ActionStepBase,
      execute: () => Promise<void>
    ) => Promise<void>
  ): Promise<void> {
    await Promise.all(this.children.map(child => child.executePerActionStep(onActionStep)))
  }
}

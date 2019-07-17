import StepBase from "../../steps/step-base"
import ActionStepBase from "../../steps/actions/action-step-base"
import AggregatorStepBase from "./aggregator-step-base"

export default class SerialStep extends AggregatorStepBase {
  constructor(
    name: string,
    children: ReadonlyArray<StepBase>
  ) {
    super(
      `${name} (serial)`,
      [],
      (self: StepBase) => children
        .map(child => ({
          from: self,
          to: child,
          type: `strong` as (`strong` | `weak`)
        }))
        .concat(children.slice(1).map((child, i) => ({
          from: children[i],
          to: child,
          type: `weak`
        }))),
      children
    )
  }

  async executePerActionStep(
    onActionStep: (
      step: ActionStepBase,
      execute: () => Promise<void>
    ) => Promise<void>
  ): Promise<void> {
    for (const child of this.children) {
      await child.executePerActionStep(onActionStep)
    }
  }
}

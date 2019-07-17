import StepBase from "../../steps/step-base"

export default abstract class ActionStepBase extends StepBase {
  async executePerActionStep(
    onActionStep: (
      step: ActionStepBase,
      execute: () => Promise<void>
    ) => Promise<void>
  ): Promise<void> {
    await onActionStep(this, () => this.execute())
  }

  protected abstract execute(): Promise<void>
}

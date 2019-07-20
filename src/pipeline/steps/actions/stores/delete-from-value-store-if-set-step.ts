import ValueStore from "../../../stores/value-store"
import StepBase from "../../step-base"
import ActionStepBase from "../action-step-base"

export default class DeleteFromValueStoreIfSetStep<TValue> extends ActionStepBase {
  constructor(
    private readonly valueStore: ValueStore<TValue>
  ) {
    super(
      `deleteFromValueStoreIfSet`,
      [{
        key: `valueStore`,
        value: valueStore.name
      }],
      (self: StepBase) => []
    )
  }

  async execute(): Promise<void> {
    this.valueStore.deleteIfSet()
  }
}

import KeyValueStore from "../../../stores/key-value-store"
import StepBase from "../../step-base"
import ActionStepBase from "../action-step-base"

export default class DeleteFromKeyValueStoreIfSetStep<TValue> extends ActionStepBase {
  constructor(
    private readonly keyValueStore: KeyValueStore<TValue>,
    private readonly key: string
  ) {
    super(
      `deleteFromKeyValueStoreIfSet`,
      [{
        key: `keyValueStore`,
        value: keyValueStore.name
      }, {
        key: `key`,
        value: key
      }],
      (self: StepBase) => []
    )
  }

  async execute(): Promise<void> {
    this.keyValueStore.deleteIfSet(this.key)
  }
}

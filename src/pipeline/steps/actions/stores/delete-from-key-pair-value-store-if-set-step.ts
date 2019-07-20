import KeyPairValueStore from "../../../stores/key-pair-value-store"
import StepBase from "../../step-base"
import ActionStepBase from "../action-step-base"

export default class DeleteFromKeyPairValueStoreIfSetStep<TValue> extends ActionStepBase {
  constructor(
    private readonly keyPairValueStore: KeyPairValueStore<TValue>,
    private readonly a: string,
    private readonly b: string
  ) {
    super(
      `deleteFromKeyPairValueStoreIfSet`,
      [{
        key: `keyValuePairStore`,
        value: keyPairValueStore.name
      }, {
        key: `a`,
        value: a
      }, {
        key: `b`,
        value: b
      }],
      (self: StepBase) => []
    )
  }

  async execute(): Promise<void> {
    this.keyPairValueStore.deleteIfSet(this.a, this.b)
  }
}

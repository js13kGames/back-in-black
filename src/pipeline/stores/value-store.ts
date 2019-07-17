import StoreBase from "./store-base"

export default class ValueStore<TValue> extends StoreBase {
  private value: null | { readonly value: TValue } = null

  hasValue(): boolean {
    return this.value !== null
  }

  get(): TValue {
    if (this.value === null) {
      throw new Error(`Unable to get a value which is not currently set.`)
    } else {
      return this.value.value
    }
  }

  tryGet(): null | TValue {
    if (this.value === null) {
      return null
    } else {
      return this.value.value
    }
  }

  set(
    value: TValue
  ): void {
    if (this.value === null) {
      this.value = { value }
    } else {
      throw new Error(`Unable to set a value which is already set.`)
    }
  }

  deleteIfSet(): void {
    this.value = null
  }
}

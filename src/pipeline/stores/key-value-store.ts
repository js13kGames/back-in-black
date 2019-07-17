import StoreBase from "./store-base"

export default class KeyValueStore<TValue> extends StoreBase {
  private readonly keysAndValues: { [key: string]: TValue } = {}

  hasKey(
    key: string
  ): boolean {
    return Object.prototype.hasOwnProperty.call(this.keysAndValues, key)
  }

  get(
    key: string
  ): TValue {
    if (this.hasKey(key)) {
      return this.keysAndValues[key]
    } else {
      throw new Error(`Unable to get key ${JSON.stringify(key)} which is not currently set.`)
    }
  }

  getAll(): { readonly [key: string]: TValue } {
    const output: { [key: string]: TValue } = {}
    for (const key in this.keysAndValues) {
      output[key] = this.keysAndValues[key]
    }
    return output
  }

  tryGet(
    key: string
  ): null | TValue {
    if (this.hasKey(key)) {
      return this.keysAndValues[key]
    } else {
      return null
    }
  }

  set(
    key: string,
    value: TValue
  ): void {
    if (this.hasKey(key)) {
      throw new Error(`Unable to set key ${JSON.stringify(key)} which is already set.`)
    } else {
      this.keysAndValues[key] = value
    }
  }

  deleteIfSet(
    key: string
  ): void {
    delete this.keysAndValues[key]
  }
}

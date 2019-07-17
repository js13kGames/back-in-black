import StoreBase from "./store-base"

export default class KeyPairValueStore<TValue> extends StoreBase {
  private readonly keyPairsAndValues: {
    [a: string]: { [b: string]: TValue }
  } = {}

  hasBaseKey(
    a: string,
  ): boolean {
    return Object.prototype.hasOwnProperty.call(this.keyPairsAndValues, a)
  }

  hasKeyPair(
    a: string,
    b: string
  ): boolean {
    return this.hasBaseKey(a)
      && Object.prototype.hasOwnProperty.call(this.keyPairsAndValues[a], b)
  }

  get(
    a: string,
    b: string
  ): TValue {
    if (this.hasKeyPair(a, b)) {
      return this.keyPairsAndValues[a][b]
    } else if (this.hasBaseKey(a)) {
      throw new Error(`Unable to retrieve key pair ${JSON.stringify(a)}:${JSON.stringify(b)} of which the second is not set.`)
    } else {
      throw new Error(`Unable to retrieve key pair ${JSON.stringify(a)}:${JSON.stringify(b)} of which the first is not set.`)
    }
  }

  getAllByBaseKey(
    a: string
  ): { readonly [b: string]: TValue } {
    if (!this.hasBaseKey(a)) {
      throw new Error(`Unable to retrieve all keys of base key ${JSON.stringify(a)} which is not set.`)
    }
    const output: { [b: string]: TValue } = {}
    for (const b in this.keyPairsAndValues[a]) {
      output[b] = this.keyPairsAndValues[a][b]
    }
    return output
  }

  set(
    a: string,
    b: string,
    value: TValue
  ): void {
    if (this.hasKeyPair(a, b)) {
      throw new Error(`Unable to set key pair ${JSON.stringify(a)}:${JSON.stringify(b)} which is already set.`)
    } else {
      if (!this.hasBaseKey(a)) {
        this.keyPairsAndValues[a] = {}
      }
      this.keyPairsAndValues[a][b] = value
    }
  }

  deleteIfSet(
    a: string,
    b: string
  ): void {
    if (this.hasKeyPair(a, b)) {
      if (Object.keys(this.keyPairsAndValues[a]).length === 1) {
        delete this.keyPairsAndValues[a]
      } else {
        delete this.keyPairsAndValues[a][b]
      }
    }
  }
}

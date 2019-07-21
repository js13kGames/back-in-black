type DeepReadonly<T extends Json> =
  T extends IJsonArray<infer R> ? IDeepReadonlyArray<R>
  : T extends IJsonObject ? IDeepReadonlyObject<T>
  : T

interface IDeepReadonlyArray<T extends Json> extends ReadonlyArray<DeepReadonly<T>> { }

type IDeepReadonlyObject<T extends IJsonObject> = {
  readonly [key in keyof T]: DeepReadonly<T[key]>
}

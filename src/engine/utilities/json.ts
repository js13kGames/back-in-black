interface IJsonArray<T extends Json> extends ReadonlyArray<T> { }
interface IJsonArrayAny extends ReadonlyArray<Json> { }

type Json =
  | string
  | number
  | boolean
  | IJsonArrayAny
  | IJsonObject
  | null

interface IJsonObject {
  readonly [key: string]: Json
}

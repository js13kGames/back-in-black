interface IEngineJsonArray<T extends EngineJson> extends ReadonlyArray<T> { }
interface IEngineJsonArrayAny extends ReadonlyArray<EngineJson> { }

type EngineJson =
  | string
  | number
  | boolean
  | IEngineJsonArrayAny
  | IEngineJsonObject
  | null

interface IEngineJsonObject {
  readonly [key: string]: EngineJson
}

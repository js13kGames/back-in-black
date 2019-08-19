let state: State

const engineVersion = 3

type EngineState = {
  readonly engineVersion: number
  readonly gameVersion: number
  readonly state: State
}

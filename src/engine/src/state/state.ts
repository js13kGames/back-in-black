let state: State
let now = 0

const engineVersion = 0

type EngineState = {
  readonly engineVersion: number
  readonly gameVersion: number
  readonly state: State
  readonly now: number
}

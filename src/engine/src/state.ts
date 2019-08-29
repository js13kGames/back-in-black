const engineStateVersion = 4

type EngineState = {
  readonly engineVersion: number
  readonly gameVersion: number
  readonly state: State
  readonly beat: number
}

function engineStateLoad(): void {
  const possibleState = engineStorageLoad<EngineState>(`state`)
  if (possibleState === null
    || possibleState.engineVersion !== engineStateVersion
    || possibleState.gameVersion !== version) {
    state = initial()
    beat = 0
  } else {
    state = possibleState.state
    beat = possibleState.beat
  }
  engineStorageDrop(`state`)
}

function engineStateSave(): void {
  engineStorageSave<EngineState>(`state`, {
    engineVersion: engineStateVersion,
    gameVersion: version,
    state,
    beat
  })
}

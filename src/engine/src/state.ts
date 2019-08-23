const engineStateVersion = 3

type EngineState = {
  readonly engineVersion: number
  readonly gameVersion: number
  readonly state: State
}

function engineStateLoad(): void {
  const possibleState = engineStorageLoad<EngineState>(gameName)
  if (possibleState === null
    || possibleState.engineVersion !== engineStateVersion
    || possibleState.gameVersion !== version) {
    state = initial()
  } else {
    state = possibleState.state
  }
  engineStorageDrop(gameName)
}

function engineStateSave(): void {
  engineStorageSave<EngineState>(gameName, {
    engineVersion: engineStateVersion,
    gameVersion: version,
    state
  })
}

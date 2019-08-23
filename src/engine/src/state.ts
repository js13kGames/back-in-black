const engineStateVersion = 3

type EngineState = {
  readonly engineVersion: number
  readonly gameVersion: number
  readonly state: State
}

function engineStateLoad(): void {
  const possibleState = engineLoad<EngineState>(gameName)
  if (possibleState === null
    || possibleState.engineVersion !== engineStateVersion
    || possibleState.gameVersion !== version) {
    state = initial()
  } else {
    state = possibleState.state
  }
  engineDrop(gameName)
}

function engineStateSave(): void {
  engineSave<EngineState>(gameName, {
    engineVersion: engineStateVersion,
    gameVersion: version,
    state
  })
}

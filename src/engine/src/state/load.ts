function engineLoadState(): void {
  const possibleState = engineLoadDirect<EngineState>(gameName)
  if (possibleState === null
    || possibleState.engineVersion !== engineVersion
    || possibleState.gameVersion !== version) {
    state = initial()
  } else {
    state = possibleState.state
    now = possibleState.now
  }
  engineDrop(gameName)
}

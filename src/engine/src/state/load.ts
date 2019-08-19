function engineLoadState(): void {
  const possibleState = engineLoad<EngineState>(gameName)
  if (possibleState === null
    || possibleState.engineVersion !== engineVersion
    || possibleState.gameVersion !== version) {
    state = initial()
  } else {
    state = possibleState.state
  }
  engineDrop(gameName)
}

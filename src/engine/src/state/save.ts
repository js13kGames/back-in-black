function engineSaveState(): void {
  engineSave<EngineState>(gameName, {
    engineVersion,
    gameVersion: version,
    state
  })
}

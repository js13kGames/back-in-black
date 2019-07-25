function engineSaveState(): void {
  engineSaveDirect<EngineState>(gameName, {
    engineVersion,
    gameVersion: version,
    state,
    now
  })
}

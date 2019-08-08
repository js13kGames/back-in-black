function engineTimingStartRender(): void {
  if (engineTimeout !== null) {
    clearTimeout(engineTimeout)
  }
  engineTimeout = null
  engineEarliestTimer = null
}

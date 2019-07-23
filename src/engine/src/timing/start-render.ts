function engineTimingStartRender(): void {
  engineTimeOfLastRender = +new Date
  if (engineTimeout !== null) {
    clearTimeout(engineTimeout)
  }
  engineTimeout = null
  engineEarliestTimer = null
}

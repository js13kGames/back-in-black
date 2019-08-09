function engineTimingSuspend(): void {
  if (audioContext) {
    audioContext.suspend()
  }
  if (engineTimeout !== null) {
    clearTimeout(engineTimeout)
    engineTimeout = null
  }
  enginePreviousDateNow = null
  enginePreviousAudioCurrentTime = null
}

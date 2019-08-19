function engineAudioSuspend(): void {
  if (audioContext) {
    audioContext.suspend()
  }
}

function engineAudioResume(): void {
  if (audioContext && audioContext.state == `suspended`) {
    audioContext.resume()
  }
}

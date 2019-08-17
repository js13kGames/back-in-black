function engineLayersPrepareForInputCallback(): void {
  if (audioContext && audioContext.state == `suspended`) {
    audioContext.resume()
  }
  engineMonotonic()
  now = engineEarliestTimer === null
    ? engineNow
    : Math.min(engineEarliestTimer.at, engineNow)
}

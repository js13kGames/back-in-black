function engineTimingEndRender(): void {
  if (engineEarliestTimer !== null) {
    if (engineEarliestTimer.at <= now) {
      now = engineEarliestTimer.at
      engineRender()
    } else {
      const capturedEarliestTimer = engineEarliestTimer
      engineTimeout = setTimeout(
        () => {
          now = capturedEarliestTimer.at
          if (capturedEarliestTimer.callback) {
            engineExecuteMutationCallback(capturedEarliestTimer.callback)
          } else {
            engineRender()
          }
        },
        engineEarliestTimer.at - now
      )
    }
  }
}

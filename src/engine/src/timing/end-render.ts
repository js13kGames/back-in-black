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
            capturedEarliestTimer.callback()
          }
          engineRender()
        },
        engineEarliestTimer.at - now
      )
    }
  }
}

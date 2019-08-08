function engineTimingEndRender(): void {
  if (engineTimeout !== null) {
    clearTimeout(engineTimeout)
  }
  engineTimeout = null
  if (engineEarliestTimer !== null) {
    if (engineEarliestTimer.at <= now) {
      now = engineEarliestTimer.at
      if (engineEarliestTimer.callback) {
        engineEarliestTimer.callback()
      }
      engineRender()
    } else {
      const capturedEarliestTimer = engineEarliestTimer
      engineMonotonic()
      setEngineTimeout()
      function setEngineTimeout(): void {
        engineTimeout = setTimeout(
          () => {
            engineMonotonic()
            if (engineNow < capturedEarliestTimer.at) {
              setEngineTimeout()
            } else {
              now = capturedEarliestTimer.at
              if (capturedEarliestTimer.callback) {
                capturedEarliestTimer.callback()
              }
              engineRender()
            }
          },
          engineConvertBeatsToMilliseconds(capturedEarliestTimer.at - engineNow)
        )
      }
    }
  }
}

function engineTimingEndRender(): void {
  if (engineEarliestTimer !== null) {
    if (engineEarliestTimer.at <= engineNow) {
      engineNow = engineEarliestTimer.at
      engineRender()
    } else {
      const capturedEarliestTimer = engineEarliestTimer
      engineTimeout = setTimeout(
        () => {
          engineNow = capturedEarliestTimer.at
          if (capturedEarliestTimer.callback) {
            engineExecuteMutationCallback(capturedEarliestTimer.callback)
          } else {
            engineRender()
          }
        },
        engineEarliestTimer.at - engineNow
      )
    }
  }
}

function engineTimingEndRender(): void {
  if (engineTimeout !== null) {
    clearTimeout(engineTimeout)
  }
  engineTimeout = null
  const possibleNext = engineTimingNext()
  if (possibleNext !== null) {
    const next = possibleNext
    if (next.at <= now) {
      now = next.at
      next.callback()
      engineRender()
    } else {
      engineMonotonic()
      setEngineTimeout()
      function setEngineTimeout(): void {
        engineTimeout = setTimeout(
          () => {
            engineMonotonic()
            if (engineNow < next.at) {
              setEngineTimeout()
            } else {
              now = next.at
              next.callback()
              engineRender()
            }
          },
          engineConvertBeatsToMilliseconds(next.at - engineNow)
        )
      }
    }
  }
}

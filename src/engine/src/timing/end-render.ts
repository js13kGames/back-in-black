function engineTimingEndRender(): void {
  if (engineTimeout !== null) {
    clearTimeout(engineTimeout)
  }
  engineTimeout = null
  const possibleNext = engineTimingNext()
  if (possibleNext !== null) {
    const next = possibleNext
    if (next.at <= engineNow) {
      next.callback()
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
              next.callback()
            }
          },
          engineConvertBeatsToMilliseconds(next.at - engineNow)
        )
      }
    }
  }
}

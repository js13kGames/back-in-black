function engineLoop(
  start: number,
  frames: ReadonlyArray<readonly [number, () => void]>
): void {
  const elapsed = engineNow - start
  if (elapsed < 0) {
    engineAt(start)
  } else {
    let loopDuration = 0
    for (const frame of frames) {
      loopDuration += frame[0]
    }

    const loopElapsed = elapsed % loopDuration
    let accumulated = 0
    for (const frame of frames) {
      accumulated += frame[0]
      if (loopElapsed < accumulated) {
        frame[1]()
        engineAt(start + accumulated + elapsed - loopElapsed)
        return
      }
    }

    // This should be very unlikely.
    accumulated += frames[0][0]
    frames[0][1]()
    engineAt(start + accumulated + elapsed - loopElapsed)
  }
}

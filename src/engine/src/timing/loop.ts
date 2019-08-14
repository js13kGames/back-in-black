function loop(
  start: number,
  frames: ReadonlyArray<readonly [number, () => void]>
): void {
  if (now < start) {
    at(start)
  } else {
    let loopDuration = 0
    for (const frame of frames) {
      loopDuration += frame[0]
    }

    let theEndOfThisFrame = start + Math.floor((now - start) / loopDuration) * loopDuration
    for (const frame of frames) {
      theEndOfThisFrame += frame[0]
      if (now < theEndOfThisFrame) {
        frame[1]()
        at(theEndOfThisFrame)
        return
      }
    }

    // This should be very unlikely.
    theEndOfThisFrame += frames[0][0]
    frames[0][1]()
    at(theEndOfThisFrame)
  }
}

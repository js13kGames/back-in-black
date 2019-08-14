function animation(
  start: number,
  frames: ReadonlyArray<readonly [number, () => void]>,
  pastEnd?: (
    ended: number
  ) => void
): void {
  if (now < start) {
    at(start)
  } else {
    let theEndOfThisFrame = start
    for (const frame of frames) {
      theEndOfThisFrame += frame[0]
      if (now < theEndOfThisFrame) {
        frame[1]()
        at(theEndOfThisFrame)
        return
      }
    }
    if (pastEnd) {
      pastEnd(theEndOfThisFrame)
    }
  }
}

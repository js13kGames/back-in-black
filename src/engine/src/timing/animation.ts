function engineAnimation(
  start: number,
  frames: ReadonlyArray<readonly [number, () => void]>,
  pastEnd?: (
    ended: number
  ) => void
): void {
  const elapsed = now - start
  if (elapsed < 0) {
    at(start)
  } else {
    let accumulated = 0
    for (const frame of frames) {
      accumulated += frame[0]
      if (elapsed < accumulated) {
        frame[1]()
        at(start + accumulated)
        return
      }
    }
    if (pastEnd) {
      pastEnd(start + accumulated)
    }
  }
}

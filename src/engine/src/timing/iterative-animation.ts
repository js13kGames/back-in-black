function iterativeAnimation(
  start: number,
  frameDuration: number,
  numberOfFrames: number,
  frame: (i: number) => void,
  pastEnd?: (
    ended: number
  ) => void
): void {
  const elapsed = now - start
  const elapsedFrames = elapsed / frameDuration
  const frameNumber = Math.floor(elapsedFrames)
  if (frameNumber < 0) {
    at(start)
  } else if (frameNumber >= numberOfFrames) {
    if (pastEnd) {
      pastEnd(start + frameDuration * numberOfFrames)
    }
  } else {
    frame(frameNumber)
    at(start + (frameNumber + 1.001 /* This is a fudge to ensure we don't ask to re-render right before the next frame due to numerical precision problems. */) * frameDuration)
  }
}

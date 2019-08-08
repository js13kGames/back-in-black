function at(
  at: number,
  callback?: EngineMutationCallback
): void {
  if (engineEarliestTimer === null || engineEarliestTimer.at >= at) {
    engineEarliestTimer = {
      at,
      callback(): void {
        now = at
        if (callback) {
          callback()
        }
        engineRender()
      }
    }
  }
}

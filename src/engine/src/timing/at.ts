function engineAt(
  at: number,
  callback?: EngineMutationCallback
): void {
  if (engineEarliestTimer === null || engineEarliestTimer.at >= at) {
    engineEarliestTimer = {
      at,
      callback
    }
  }
}

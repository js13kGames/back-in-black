const engineAnimationsPhaseDurations: number[] = []

function engineAnimationsClear(): void {
  engineAnimationsPhaseDurations.length = 0
  engineAnimationsPhaseDurations.push(0)
}

function engineAnimationsElapse(
  milliseconds: number
): void {
  engineAnimationsPhaseDurations[engineAnimationsPhaseDurations.length - 1] += milliseconds
}

function engineAnimationsPhase(): void {
  engineAnimationsPhaseDurations.push(0)
}

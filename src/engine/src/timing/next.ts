function engineTimingNext(): null | {
  readonly at: number
  readonly callback: () => void
} {
  let output = engineEarliestTimer
  const nextBeat = engineTimingNextBeat()
  if (output === null || (nextBeat !== null && output.at >= nextBeat.at)) {
    output = nextBeat
  }
  return output
}

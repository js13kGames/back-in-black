function engineTimingNext(): null | {
  readonly at: number
  readonly callback: () => void
} {
  return engineEarliestTimer
}

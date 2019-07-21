function linearInterpolate(
  from: number,
  to: number,
  mixUnitInterval: number
): number {
  return from + (to - from) * mixUnitInterval
}

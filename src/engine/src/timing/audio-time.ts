let engineAudioTimeBase: number

function audioTime(
  beatProgressUnitInterval: number
): number {
  return Math.max(0, engineAudioTimeBase + engineConvertBeatsToSeconds(beatProgressUnitInterval))
}

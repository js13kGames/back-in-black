function engineConvertSecondsToBeats(
  seconds: number
): number {
  return seconds * beatsPerMinute / 60
}

function engineConvertMillisecondsToBeats(
  milliseconds: number
): number {
  return engineConvertSecondsToBeats(milliseconds / 1000)
}

function engineConvertBeatsToSeconds(
  beats: number
): number {
  return beats / beatsPerMinute * 60
}

function engineConvertBeatsToMilliseconds(
  beats: number
): number {
  return engineConvertBeatsToSeconds(beats) * 1000
}

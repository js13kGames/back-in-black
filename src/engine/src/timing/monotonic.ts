let enginePreviousAudioCurrentTime: null | number = null
let enginePreviousDateNow: null | number = null

function engineMonotonic(): void {
  let delta = 0
  const nextAudioCurrentTime = audioContext && audioContext.state === `running`
    ? audioContext.currentTime
    : null
  const nextDateNow = +new Date
  if (nextAudioCurrentTime !== null && enginePreviousAudioCurrentTime !== null) {
    delta = engineConvertSecondsToBeats(nextAudioCurrentTime - enginePreviousAudioCurrentTime)
  } else if (enginePreviousDateNow !== null) {
    delta = engineConvertMillisecondsToBeats(nextDateNow - enginePreviousDateNow)
  }
  delta = Math.max(0, delta)

  let deltaCap = 0
  if (engineEarliestTimer != null) {
    deltaCap = Math.max(0, engineEarliestTimer.at - engineNow)
  }
  deltaCap = Math.max(0, deltaCap) + 250

  delta = Math.min(delta, deltaCap)

  engineNow += delta
  enginePreviousAudioCurrentTime = nextAudioCurrentTime
  enginePreviousDateNow = nextDateNow
}

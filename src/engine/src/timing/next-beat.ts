let engineLastBeat: null | number = null

function engineTimingNextBeat(): null | {
  readonly at: number
  readonly callback: () => void
} {
  let nextBeat = Math.floor(engineNow - 0.5) + 1
  if (nextBeat === engineLastBeat) {
    nextBeat++
  }
  if (enginePreviousAudioCurrentTime !== null) {
    engineAudioTimeBase = enginePreviousAudioCurrentTime + engineConvertBeatsToSeconds(nextBeat - engineNow)
    return {
      at: nextBeat - 0.4,
      callback(): void {
        now = nextBeat
        engineBeatCallback()
        engineLastBeat = nextBeat
        engineTimingEndRender()
      }
    }
  } else {
    return null
  }
}

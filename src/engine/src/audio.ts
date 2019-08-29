declare const webkitAudioContext: {
  prototype: AudioContext
  new(contextOptions?: AudioContextOptions): AudioContext
}

let engineAudioTimeout: undefined | number
let engineAudioTimeOfLastBeat: number

function engineAudioStart(): void {
  try {
    audioContext = new AudioContext()
  } catch (e) {
    try {
      audioContext = new webkitAudioContext()
    } catch (e) {
      return
    }
  }

  audioReady()
  engineAudioResume()
}

function engineAudioConvertSecondsToBeats(
  seconds: number
): number {
  return seconds * beatsPerMinute / 60
}

function engineAudioConvertMillisecondsToBeats(
  milliseconds: number
): number {
  return engineAudioConvertSecondsToBeats(milliseconds / 1000)
}

function engineAudioConvertBeatsToSeconds(
  beats: number
): number {
  return beats / beatsPerMinute * 60
}

function engineAudioConvertBeatsToMilliseconds(
  beats: number
): number {
  return engineAudioConvertBeatsToSeconds(beats) * 1000
}


function engineAudioBeatCallback(): void {
  const currentTime = audioContext.currentTime
  const middleOfPreviousBeat = beatTime(0.5)
  if (currentTime > middleOfPreviousBeat) {
    engineAudioTimeOfLastBeat = Math.max(beatTime(1), currentTime)
    renderBeat()
    beat++
  }
  engineAudioTimeout = setTimeout(engineAudioBeatCallback, 1000 * (beatTime(0.6) - currentTime))
}

function engineAudioBeatTime(
  beats: number,
): number {
  return engineAudioTimeOfLastBeat + engineAudioConvertBeatsToSeconds(beats)
}

function engineAudioResume(): void {
  if (audioContext && audioContext.state == `suspended`) {
    audioContext.resume().then(() => {
      engineAudioTimeOfLastBeat = audioContext.currentTime
      renderBeat()
      engineAudioTimeout = setTimeout(engineAudioBeatCallback, engineAudioConvertBeatsToMilliseconds(0.6))
    })
  }
}

function engineAudioSuspend(): void {
  if (audioContext) {
    audioContext.suspend().then(() => {
      clearTimeout(engineAudioTimeout)
      engineAudioTimeout = undefined
    })
  }
}

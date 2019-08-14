let audioContext: AudioContext
let engineBeatCallback: () => void

declare const webkitAudioContext: {
  prototype: AudioContext
  new(contextOptions?: AudioContextOptions): AudioContext
}

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
  engineBeatCallback = audioReady()
}

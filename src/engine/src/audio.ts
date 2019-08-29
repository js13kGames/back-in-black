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
  audioReady()
}

function engineAudioResume(): void {
  if (audioContext && audioContext.state == `suspended`) {
    audioContext.resume()
  }
}

function engineAudioSuspend(): void {
  if (audioContext) {
    audioContext.suspend()
  }
}

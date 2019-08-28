let padOscillator: OscillatorNode
let padGain: GainNode

function setUpPad(): void {
  padOscillator = audioContext.createOscillator()
  padOscillator.type = `sawtooth`

  padGain = audioContext.createGain()
  padGain.gain.value = 0

  const bandpass = audioContext.createBiquadFilter()
  bandpass.type = `bandpass`
  bandpass.frequency.value = 600
  bandpass.Q.value = 1.2

  const sampleRate = audioContext.sampleRate
  const buffer = audioContext.createBuffer(2, sampleRate, sampleRate)
  for (let channel = 0; channel < 2; channel++) {
    const channelData = buffer.getChannelData(channel)
    for (let i = 0; i < sampleRate; i++) {
      channelData[i] = (Math.random() * 2 - 1) * (Math.pow(1 - (i / sampleRate), 8192) + 1)
    }
  }

  const convolver = audioContext.createConvolver()
  convolver.buffer = buffer

  padOscillator.connect(padGain)
  padGain.connect(bandpass)
  bandpass.connect(convolver)
  convolver.connect(audioContext.destination)

  padOscillator.start()
}



function padOn(at: number, note: number): void {
  at
  note
  // const startTime = audioTime(at)
  // const frequency = 440 * Math.pow(2, note / 12)
  // padOscillator.frequency.setValueAtTime(frequency, startTime)
  // padGain.gain.setValueAtTime(2.4, startTime)
}

function padOff(at: number): void {
  at
  // const startTime = audioTime(at)
  // padGain.gain.setValueAtTime(0, startTime)
}

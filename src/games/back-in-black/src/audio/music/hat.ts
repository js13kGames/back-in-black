let hatGain: GainNode

function setUpHat(): void {
  hatGain = audioContext.createGain()
  hatGain.gain.value = 0
  const hatBandpass = audioContext.createBiquadFilter()
  hatBandpass.type = `bandpass`
  hatBandpass.frequency.value = 10000
  hatBandpass.Q.value = 0.5
  const hatHighpass = audioContext.createBiquadFilter()
  hatHighpass.type = `highpass`
  hatHighpass.frequency.value = 7000
  whiteNoise.connect(hatGain)
  hatGain.connect(hatBandpass)
  hatBandpass.connect(hatHighpass)
  hatHighpass.connect(audioContext.destination)
}

function hat(at: number, duration: number): void {
  at
  duration
  // const startTime = audioTime(at)
  // hatGain.gain.setValueAtTime(0.4, startTime)
  // hatGain.gain.linearRampToValueAtTime(0, startTime + duration)
}

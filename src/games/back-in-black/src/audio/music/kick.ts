let kickOscillator: OscillatorNode
let kickGain: GainNode

function setUpKick(): void {
  kickOscillator = audioContext.createOscillator()
  kickGain = audioContext.createGain()
  kickGain.gain.value = 0
  kickOscillator.connect(kickGain)
  kickGain.connect(audioContext.destination)
  kickOscillator.start(0)
}

function kick(at: number): void {
  at
  // const startTime = audioTime(at)
  // kickOscillator.frequency.setValueAtTime(200, startTime)
  // kickGain.gain.setValueAtTime(1, startTime)

  // const endTime = startTime + 0.1
  // kickOscillator.frequency.linearRampToValueAtTime(0, endTime)
  // kickGain.gain.linearRampToValueAtTime(0, endTime)
}

let bassOscillatorA: OscillatorNode
let bassOscillatorB: OscillatorNode
let bassLowpass: BiquadFilterNode
let bassGain: GainNode

function setUpBass(): void {
  bassOscillatorA = audioContext.createOscillator()
  bassOscillatorA.type = `sawtooth`
  bassOscillatorA.detune.value = -6

  bassOscillatorB = audioContext.createOscillator()
  bassOscillatorB.detune.value = 6
  bassOscillatorB.type = `sawtooth`

  const channelMerger = audioContext.createChannelMerger(2)

  bassLowpass = audioContext.createBiquadFilter()
  bassLowpass.type = `lowpass`
  bassLowpass.Q.value = 8

  bassGain = audioContext.createGain()
  bassGain.gain.value = 0

  bassOscillatorA.connect(channelMerger, undefined, 0)
  bassOscillatorB.connect(channelMerger, undefined, 1)
  channelMerger.connect(bassLowpass)
  bassLowpass.connect(bassGain)
  bassGain.connect(audioContext.destination)

  bassOscillatorA.start(0)
  bassOscillatorB.start(0)
}

function bassOn(at: number, note: number): void {
  const startTime = beatTime(at)
  note += 3
  const frequency = 55 * Math.pow(2, note / 12)
  bassOscillatorA.frequency.setValueAtTime(frequency, startTime)
  bassOscillatorB.frequency.setValueAtTime(frequency, startTime)
  bassLowpass.frequency.setValueAtTime(2000, startTime)
  bassLowpass.frequency.linearRampToValueAtTime(500, startTime + 0.1)
  bassGain.gain.setValueAtTime(1, startTime)
  bassGain.gain.linearRampToValueAtTime(0.5, startTime + 0.15)
}

function bassOff(at: number): void {
  const startTime = beatTime(at)
  bassGain.gain.setValueAtTime(0, startTime)
}

const leads: (readonly [OscillatorNode, OscillatorNode, GainNode])[] = []

function setUpLead(): void {
  const channelMerger = audioContext.createChannelMerger()
  channelMerger.connect(audioContext.destination)
  for (let i = 0; i < 2; i++) {
    const oscillatorA = audioContext.createOscillator()
    oscillatorA.type = `square`
    oscillatorA.detune.value = -6

    const oscillatorB = audioContext.createOscillator()
    oscillatorB.type = `square`
    oscillatorB.detune.value = 6

    const gain = audioContext.createGain()
    gain.gain.value = 0

    oscillatorA.connect(gain)
    oscillatorB.connect(gain)
    gain.connect(channelMerger, undefined, i)

    oscillatorA.start()
    oscillatorB.start()

    leads.push([oscillatorA, oscillatorB, gain])
  }
}

function leadOn(at: number, channel: 0 | 1, note: number): void {
  at
  channel
  note
  // const startTime = audioTime(at)
  // note += 3
  // const frequency = 220 * Math.pow(2, note / 12)
  // leads[channel][0].frequency.setValueAtTime(frequency, startTime)
  // leads[channel][1].frequency.setValueAtTime(frequency, startTime)
  // leads[channel][2].gain.setValueAtTime(0.1, startTime)
}

function leadOff(at: number, channel: 0 | 1): void {
  at
  channel
  // const startTime = audioTime(at)
  // leads[channel][2].gain.setValueAtTime(0, startTime)
}

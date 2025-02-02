const version = 0
const beatsPerMinute = 120

type State = null

function initial(): State {
  return null
}

const safeAreaWidthVirtualPixels = 320
const safeAreaHeightVirtualPixels = 240
const halfSafeAreaWidthVirtualPixels = safeAreaWidthVirtualPixels / 2
const halfSafeAreaHeightVirtualPixels = safeAreaHeightVirtualPixels / 2
const fullWidthVirtualPixels = safeAreaWidthVirtualPixels * 2
const fullHeightVirtualPixels = safeAreaHeightVirtualPixels * 2

let kick: (at: number) => void
let snare: (at: number) => void
let hat: (at: number, duration: number) => void
let cowbell: (at: number) => void

function render(): undefined | (() => void) {
  const mainViewport = viewport(
    safeAreaWidthVirtualPixels, safeAreaHeightVirtualPixels,
    fullWidthVirtualPixels, fullHeightVirtualPixels,
    0, 0
  )

  sprite(mainViewport, background_svg)

  // Kick
  hitbox(mainViewport, -35, -10, 85, 112, () => sound(kick))

  // Snare
  hitbox(mainViewport, 0, -65, 87, 55, () => sound(snare))

  // Closed Hat
  hitbox(mainViewport, -93, -65, 85, 53, () => sound(time => hat(time, 0.05)))

  // Open Hat
  hitbox(mainViewport, -40, -105, 97, 48, () => sound(time => hat(time, 0.15)))

  // Cowbell
  hitbox(mainViewport, 55, -10, 35, 50, () => sound(cowbell))

  // Metronome
  hitbox(mainViewport, -83, 2, 22.5, 35, () => { })

  // Tape Recorder
  hitbox(mainViewport, -98, 50, 35, 45, () => { })

  return
}

function audioReady(): void {
  const sampleRate = audioContext.sampleRate

  var whiteNoiseBuffer = audioContext.createBuffer(1, sampleRate, sampleRate)
  var whiteNoiseData = whiteNoiseBuffer.getChannelData(0)
  for (var sample = 0; sample < sampleRate; sample++) {
    whiteNoiseData[sample] = Math.random() * 2 - 1
  }
  var whiteNoise = audioContext.createBufferSource()
  whiteNoise.buffer = whiteNoiseBuffer
  whiteNoise.loop = true
  whiteNoise.start()

  var kickOscillator = audioContext.createOscillator()
  var kickGain = audioContext.createGain()
  kickGain.gain.value = 0
  kickOscillator.connect(kickGain)
  kickGain.connect(audioContext.destination)
  kickOscillator.start(0)

  kick = (at: number): void => {
    kickOscillator.frequency.setValueAtTime(200, at)
    kickGain.gain.setValueAtTime(1, at)

    var endTime = at + 0.1
    kickOscillator.frequency.linearRampToValueAtTime(0, endTime)
    kickGain.gain.linearRampToValueAtTime(0, endTime)
  }

  var hatGain = audioContext.createGain()
  hatGain.gain.value = 0
  var hatBandpass = audioContext.createBiquadFilter()
  hatBandpass.type = "bandpass"
  hatBandpass.frequency.value = 10000
  hatBandpass.Q.value = 0.5
  var hatHighpass = audioContext.createBiquadFilter()
  hatHighpass.type = "highpass"
  hatHighpass.frequency.value = 7000
  whiteNoise.connect(hatGain)
  hatGain.connect(hatBandpass)
  hatBandpass.connect(hatHighpass)
  hatHighpass.connect(audioContext.destination)

  hat = (at: number, duration: number): void => {
    hatGain.gain.setValueAtTime(0.4, at)
    hatGain.gain.linearRampToValueAtTime(0, at + duration)
  }

  var snareGain = audioContext.createGain()
  snareGain.gain.value = 0
  var snareBandpass = audioContext.createBiquadFilter()
  snareBandpass.type = "bandpass"
  snareBandpass.frequency.value = 1800
  snareBandpass.Q.value = 0.9
  whiteNoise.connect(snareGain)
  snareGain.connect(snareBandpass)
  snareBandpass.connect(audioContext.destination)

  var snareOscillator = audioContext.createOscillator()
  snareOscillator.type = "triangle"
  var snareOscillatorGain = audioContext.createGain()
  snareOscillatorGain.gain.value = 0
  snareOscillator.connect(snareOscillatorGain)
  snareOscillatorGain.connect(audioContext.destination)
  snareOscillator.start(0)

  snare = (at: number): void => {
    snareGain.gain.setValueAtTime(1, at)
    snareBandpass.frequency.setValueAtTime(2000, at)
    snareOscillatorGain.gain.setValueAtTime(1, at)
    snareOscillator.frequency.setValueAtTime(100, at)

    snareGain.gain.linearRampToValueAtTime(0.4, at + 0.1)
    snareGain.gain.linearRampToValueAtTime(0, at + 0.2)
    snareBandpass.frequency.linearRampToValueAtTime(1000, at + 0.15)
    snareOscillatorGain.gain.linearRampToValueAtTime(0, at + 0.08)
    snareOscillator.frequency.linearRampToValueAtTime(0, at + 0.08)
  }

  const cowbellOscillatorA = audioContext.createOscillator()
  cowbellOscillatorA.type = `square`
  cowbellOscillatorA.frequency.value = 835
  const cowbellOscillatorB = audioContext.createOscillator()
  cowbellOscillatorB.type = `square`
  cowbellOscillatorB.frequency.value = 555
  const cowbellBandpass = audioContext.createBiquadFilter()
  cowbellBandpass.frequency.value = 200
  cowbellBandpass.Q.value = 4
  const cowbellGain = audioContext.createGain()
  cowbellGain.gain.value = 0
  cowbellOscillatorA.connect(cowbellBandpass)
  cowbellOscillatorB.connect(cowbellBandpass)
  cowbellBandpass.connect(cowbellGain)
  cowbellGain.connect(audioContext.destination)
  cowbellOscillatorA.start(0)
  cowbellOscillatorB.start(0)

  cowbell = (at: number): void => {
    cowbellGain.gain.setValueAtTime(5, at)
    cowbellGain.gain.linearRampToValueAtTime(0, at + 0.1)
  }
}

function renderBeat(): void {
}

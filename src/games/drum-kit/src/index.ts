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

let kick: undefined | ((at: number) => void)
let snare: undefined | ((at: number) => void)
let hat: undefined | ((at: number, duration: number) => void)
let cowbell: undefined | ((at: number) => void)

function layers(
  layer: LayerFactory
): void {
  layer(
    safeAreaWidthVirtualPixels, fullWidthVirtualPixels,
    safeAreaHeightVirtualPixels, fullHeightVirtualPixels,
    0, 0,
    () => {
      draw(background_svg, [translate(halfSafeAreaWidthVirtualPixels, halfSafeAreaHeightVirtualPixels)])

      // Kick
      hitbox(90, 110, [translate(170, 165)], () => {
        if (kick) {
          kick(audioContext.currentTime)
        }
      })

      // Snare
      hitbox(90, 55, [translate(205, 82.5)], () => {
        if (snare) {
          snare(audioContext.currentTime)
        }
      })

      // Closed Hat
      hitbox(85, 50, [translate(110, 80)], () => {
        if (hat) {
          hat(audioContext.currentTime, 0.05)
        }
      })

      // Open Hat
      hitbox(95, 45, [translate(170, 37.5)], () => {
        if (hat) {
          hat(audioContext.currentTime, 0.15)
        }
      })

      // Cowbell
      hitbox(30, 45, [translate(232.5, 135)], () => {
        if (cowbell) {
          cowbell(audioContext.currentTime)
        }
      })

      // Metronome
      hitbox(22.5, 35, [translate(88.75, 139)], () => { })

      // Tape Recorder
      hitbox(40, 45, [translate(80, 190)], () => { })
    }
  )
}

function audioReady(): () => void {
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

  return () => {
  }
}

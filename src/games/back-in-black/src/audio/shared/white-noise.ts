let whiteNoise: AudioBufferSourceNode

function setUpWhiteNoise(): void {
  const sampleRate = audioContext.sampleRate
  const buffer = audioContext.createBuffer(1, sampleRate, sampleRate)
  const data = buffer.getChannelData(0)
  for (let sample = 0; sample < sampleRate; sample++) {
    data[sample] = Math.random() * 2 - 1
  }
  whiteNoise = audioContext.createBufferSource()
  whiteNoise.buffer = buffer
  whiteNoise.loop = true
  whiteNoise.start()
}

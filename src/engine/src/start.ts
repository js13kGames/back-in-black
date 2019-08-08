onload = () => {
  engineLoadState()
  engineAudioStart()
  engineCreateLayers()
  engineMonotonic()
  onresize = () => {
    engineMonotonic()
    engineRender()
  }
  engineRender()
  onbeforeunload = () => {
    engineSaveState()
  }
}

onload = () => {
  engineLoadState()
  engineAudioStart()
  engineCreateLayers()
  onresize = engineRender
  engineRender()
  onbeforeunload = () => {
    engineSaveState()
  }
}

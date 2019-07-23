onload = () => {
  engineLoadState()
  engineCreateLayers()
  onresize = engineRender
  engineRender()
  onbeforeunload = () => {
    engineSaveState()
  }
}

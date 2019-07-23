onload = () => {
  engineLoadState()
  onresize = engineRender
  engineRender()
  onbeforeunload = () => {
    engineSaveState()
  }
}

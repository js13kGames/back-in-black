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
  onkeydown = engineKeyInputHandleKey
  onfocus = engineTimingResume
  onblur = engineTimingSuspend
}

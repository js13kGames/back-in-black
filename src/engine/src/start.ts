onload = () => {
  engineLoadState()
  engineAudioStart()
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

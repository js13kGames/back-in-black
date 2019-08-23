onload = () => {
  engineLoadState()
  engineAudioStart()
  engineRender()
  onbeforeunload = engineSaveState
  onkeydown = engineKeyInputHandleKey
  onblur = engineAudioSuspend
  onresize = engineViewportsResize
}

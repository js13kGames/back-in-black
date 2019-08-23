onload = () => {
  engineStateLoad()
  engineAudioStart()
  engineRender()
  onbeforeunload = engineStateSave
  onkeydown = engineKeyInputHandleKey
  onblur = engineAudioSuspend
  onresize = engineViewportsResize
}

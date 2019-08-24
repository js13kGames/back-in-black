function engineRender(): void {
  engineKeyInputStartRender()
  engineAnimationsClear()
  engineViewportsRender()
  engineAnimationsSendNextPhaseToBrowser()
}

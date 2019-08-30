function engineRender(): void {
  engineKeyInputStartRender()
  engineAnimationsClear()
  engineViewportsRender()
  engineAnimationsSendToBrowser()
}

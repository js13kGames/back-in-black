function engineKeyInputHandleKey(e: KeyboardEvent): void {
  const callback = engineKeyInputCallbacks[e.code as KeyCode]
  if (callback) {
    engineLayersPrepareForInputCallback()
    callback()
    engineRender()
    e.preventDefault()
  }
}

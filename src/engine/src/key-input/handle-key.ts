function engineKeyInputHandleKey(e: KeyboardEvent): void {
  const callback = engineKeyInputCallbacks[e.code as EngineKeyCode]
  if (callback) {
    callback()
    engineRender()
    e.preventDefault()
  }
}

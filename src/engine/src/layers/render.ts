const engineRenderCallbacks: (() => void)[] = []

function engineRender(): void {
  engineTimingStartRender()
  engineKeyInputStartRender()
  for (const callback of engineRenderCallbacks) {
    callback()
  }
  engineTimingEndRender()
}

const engineRenderCallbacks: (() => void)[] = []

function engineRender(): void {
  engineTimingStartRender()
  for (const callback of engineRenderCallbacks) {
    callback()
  }
  engineTimingEndRender()
}

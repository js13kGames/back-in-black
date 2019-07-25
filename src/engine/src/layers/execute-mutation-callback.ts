type EngineMutationCallback = () => void

function engineExecuteMutationCallback(
  callback: EngineMutationCallback
): void {
  callback()
  engineRender()
}
